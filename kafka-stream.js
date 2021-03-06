/* global process, require, setTimeout, setInterval, clearInterval */

const fs = require('fs')

const axios = require('axios')
const Kafka = require('no-kafka')
const queue = require('async.queue')

const ProfileScraper = require('./profile-scraper')
const formatComment = require('./format-comment')

require('dotenv').config()

async function fetchSubreddit (subreddit, cb, after) {
  try {
    console.log('fetching', subreddit)
    let path = `https://www.reddit.com/r/${subreddit}/comments.json?limit=100`

    if (typeof after !== 'undefined') {
      path = `${path}?after=${after}`
    }

    const response = await axios.get(path)
    const { data } = response.data
    data.children.forEach(comment => cb(comment.data))

    return {}
  } catch (error) {
    return { error }
  }
}

async function main () {
  try {
    const cert = process.env.KAFKA_CLIENT_CERT
    const key = process.env.KAFKA_CLIENT_CERT_KEY
    const url = process.env.KAFKA_URL

    fs.writeFileSync('./client.crt', cert)
    fs.writeFileSync('./client.key', key)

    const producer = new Kafka.Producer({
      clientId: 'reddit-comment-producer',
      connectionString: url.replace(/\+ssl/g, ''),
      ssl: {
        certFile: './client.crt',
        keyFile: './client.key'
      }
    })

    const scraper = new ProfileScraper()

    const q = queue(async (message, cb) => {
      setTimeout(async () => {
        try {
          await producer.send({
            topic: 'northcanadian-72923.reddit-comments',
            partition: 0,
            message: {
              value: JSON.stringify(message)
            }
          })
          console.log('sent', message.author)
          cb()
        } catch (e) {
          console.log(e)
          cb()
        }
      }, 500)
    }, 1)

    await producer.init()
    console.log('connected!')

    let interval

    const stream = () => {
      if (q.length() > 500) {
        clearInterval(interval)
        q.drain = () => {
          interval = setInterval(stream, 1000)
        }
      } else {
        fetchSubreddit('politics', async (c) => {
          const author = c.author
          const profile = await scraper.fetchProfile(`u/${author}`)
          const comment = formatComment(profile, c)

          if (!profile.error) {
            q.push(comment)
          } else {
            console.log(profile.error)
          }
        })
      }
    }

    interval = setInterval(stream, 1000)
  } catch (e) {
    console.log(e)
  }
}

main()
