import axios from "axios"
import * as cheerio from "cheerio"
import https from "https"
import Market from "@/common/models/market"
import logger from "@/common/config/logger"
import sequelize from "@/common/config/database"
import { MarketAttributes } from "@/common/utils/types"

// Generate realistic browser headers that mimic Chrome
function getBrowserHeaders() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  ]
  
  const acceptLanguages = [
    'en-US,en;q=0.9',
    'en-GB,en;q=0.9,en-US;q=0.8',
    'en-US,en;q=0.9,fr;q=0.8'
  ]

  return {
    'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': acceptLanguages[Math.floor(Math.random() * acceptLanguages.length)],
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"'
  }
}

// Add random delay to mimic human behavior
function randomDelay(min = 1000, max = 3000) {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min))
}

async function scrapeRSEMarketData() {
  const url = "https://rse.rw"
  logger.info(`Attempting to scrape data from ${url}`)

  try {
    // Add delay before request to avoid being too aggressive
    await randomDelay(500, 1500)

    // Create a custom HTTPS agent that ignores certificate errors
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Ignore SSL certificate errors
      secureProtocol: 'TLSv1_2_method', // Use TLS 1.2
    })

    // Configure axios with browser-like settings
    const axiosConfig = {
      headers: getBrowserHeaders(),
      timeout: 30000, // 30 second timeout
      maxRedirects: 5,
      validateStatus: (status: number) => status < 400, // Accept redirects
      // Disable compression handling to let axios handle it
      decompress: true,
      // Follow redirects
      maxContentLength: 50 * 1024 * 1024, // 50MB max
      maxBodyLength: 50 * 1024 * 1024,
      // Add HTTPS agent to handle certificate issues
      httpsAgent: httpsAgent,
      // Also handle HTTP requests
      httpAgent: false,
    }

    logger.info('Making request with browser-like headers...')
    const { data, status, headers: responseHeaders } = await axios.get(url, axiosConfig)
    
    logger.info(`Response received: Status ${status}, Content-Type: ${responseHeaders['content-type']}`)

    const $ = cheerio.load(data)

    const table = $(".main__table")
    if (!table.length) {
      logger.warn("Market table not found on the page.")
      // Log page structure for debugging
      logger.debug(`Page title: ${$('title').text()}`)
      logger.debug(`Page contains ${$('table').length} tables total`)
      return
    }

    const rows = table.find("tbody tr")
    if (!rows.length) {
      logger.warn("No data rows found in the market table.")
      logger.debug(`Table structure: ${table.html()?.substring(0, 500)}...`)
      return
    }

    const marketEntries: any = []
    const scrapedAt = new Date() // Use a single timestamp for this scrape run

    for (const row of rows) {
      const cells = $(row).find("td")
      if (cells.length < 6) {
        logger.warn("Skipping row due to insufficient cells:", $(row).text())
        continue
      }

      const security = $(cells[0]).text().trim()
      const closing = Number.parseFloat($(cells[1]).text().trim().replace(/,/g, ""))
      const previous = Number.parseFloat($(cells[2]).text().trim().replace(/,/g, ""))
      const changeText = $(cells[3]).text().trim().replace(/%/g, "")
      const change = Number.parseFloat(changeText)
      const volume = Number.parseInt($(cells[4]).text().trim().replace(/,/g, ""), 10)
      const value = Number.parseInt($(cells[5]).text().trim().replace(/,/g, ""), 10)

      // Basic validation
      if (isNaN(closing) || isNaN(previous) || isNaN(change) || isNaN(volume) || isNaN(value) || !security) {
        logger.warn("Skipping row due to invalid data:", {
          security,
          closing,
          previous,
          change,
          volume,
          value,
        })
        continue
      }

      marketEntries.push({
        security,
        closing,
        previous,
        change,
        volume,
        value,
        scrapedAt,
      })
    }

    if (marketEntries.length === 0) {
      logger.info("No valid market entries were scraped.")
      return
    }

    // Add small delay before database operations
    await randomDelay(200, 500)

    // Use a transaction for bulk upsert
    await sequelize.transaction(async (t) => {
      for (const entry of marketEntries) {
        await Market.upsert(entry, {
          transaction: t,
          conflictFields: ["security", "scrapedAt"], // Define unique constraint for upsert
        })
      }
    })

    logger.info(`Successfully scraped and saved ${marketEntries.length} market entries.`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(`Axios error scraping RSE market data:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        message: error.message,
        code: error.code
      })
    } else {
      logger.error(`Error scraping RSE market data: ${(error as Error).message}`)
    }
  }
}

// Alternative function using session-based requests for even more realistic behavior
async function scrapeRSEMarketDataWithSession() {
  const url = "https://rse.rw"
  logger.info(`Attempting to scrape data from ${url} with session simulation`)

  try {
    // Create a custom HTTPS agent for session
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      secureProtocol: 'TLSv1_2_method',
    })

    // Create axios instance with persistent cookies and headers
    const session = axios.create({
      timeout: 30000,
      maxRedirects: 5,
      withCredentials: true, // Enable cookies
      headers: getBrowserHeaders(),
      httpsAgent: httpsAgent,
    })

    // First, make a request to the homepage to establish session
    logger.info('Establishing session...')
    await session.get(url)
    
    // Wait a bit like a real user would
    await randomDelay(1000, 2000)

    // Now make the actual request for data
    logger.info('Fetching market data...')
    const { data, status } = await session.get(url)
    
    logger.info(`Response received: Status ${status}`)

    // Same scraping logic as the main function
    const $ = cheerio.load(data)

    const table = $(".main__table")
    if (!table.length) {
      logger.warn("Market table not found on the page.")
      logger.debug(`Page title: ${$('title').text()}`)
      logger.debug(`Page contains ${$('table').length} tables total`)
      return
    }

    const rows = table.find("tbody tr")
    if (!rows.length) {
      logger.warn("No data rows found in the market table.")
      logger.debug(`Table structure: ${table.html()?.substring(0, 500)}...`)
      return
    }

    const marketEntries: MarketAttributes[] = []
    const scrapedAt = new Date()

    for (const row of rows) {
      const cells = $(row).find("td")
      if (cells.length < 6) {
        logger.warn("Skipping row due to insufficient cells:", $(row).text())
        continue
      }

      const security = $(cells[0]).text().trim()
      const closing = Number.parseFloat($(cells[1]).text().trim().replace(/,/g, ""))
      const previous = Number.parseFloat($(cells[2]).text().trim().replace(/,/g, ""))
      const changeText = $(cells[3]).text().trim().replace(/%/g, "")
      const change = Number.parseFloat(changeText)
      const volume = Number.parseInt($(cells[4]).text().trim().replace(/,/g, ""), 10)
      const value = Number.parseInt($(cells[5]).text().trim().replace(/,/g, ""), 10)

      if (isNaN(closing) || isNaN(previous) || isNaN(change) || isNaN(volume) || isNaN(value) || !security) {
        logger.warn("Skipping row due to invalid data:", {
          security,
          closing,
          previous,
          change,
          volume,
          value,
        })
        continue
      }

      console.log(`Scraped entry: ${security} - Closing: ${closing}, Previous: ${previous}, Change: ${change}, Volume: ${volume}, Value: ${value}`)

      marketEntries.push({
        security,
        closing,
        previous,
        change,
        volume,
        value,
        scrapedAt,
      })
    }

    if (marketEntries.length === 0) {
      logger.info("No valid market entries were scraped.")
      return
    }

    await randomDelay(200, 500)

    await sequelize.transaction(async (t) => {
      for (const entry of marketEntries) {
        await Market.upsert(entry, {
          transaction: t
        })
      }
    })

    logger.info(`Successfully scraped and saved ${marketEntries.length} market entries.`)
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(`Session-based Axios error:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        code: error.code
      })
    } else {
      logger.error(`Error in session-based scraping: ${(error as Error).message}`)
    }
  }
}

// To run this script manually or via a cron job:
// node dist/scripts/scrapeRSE.js
// For scheduling, you would typically use a library like 'node-cron' in your main app or a separate process.
// Example:
// import cron from 'node-cron';
// cron.schedule('0 */12 * * *', scrapeRSEMarketData); // Run every 12 hours (twice a day)

// Export the functions for external use (e.g., in index.ts or a dedicated cron file)
export { scrapeRSEMarketData, scrapeRSEMarketDataWithSession }

// Immediately invoke for testing/manual run if this file is executed directly
if (require.main === module) {
  scrapeRSEMarketData()
}