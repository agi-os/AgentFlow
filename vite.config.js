import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'
import dotenv from 'dotenv'
import Papa from 'papaparse'

// Load environment variables from .env
dotenv.config()

const loadBlueprints = async extensions => {
  const allBlueprints = {}
  const githubPAT = process.env.PAT // Get PAT from .env

  for (const extension of extensions) {
    try {
      let response

      if (extension.repository.includes('api.github.com') && githubPAT) {
        // Fetch repository content metadata
        response = await fetch(extension.repository, {
          headers: {
            Authorization: `token ${githubPAT}`,
          },
        })

        const data = await response.json()
        // Get the download URL
        const downloadUrl = data.download_url

        // Fetch the actual blueprints.json content
        response = await fetch(downloadUrl)
      } else {
        // Fetch the blueprints.json from main
        response = await fetch(
          `https://raw.githubusercontent.com/${extension.repository}/main/blueprints.json`
        )
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blueprints = await response.json()

      allBlueprints[extension.name] = blueprints
    } catch (error) {
      console.error(
        `Error loading blueprints from ${extension.repository}:`,
        error
      )
    }
  }

  return allBlueprints
}

const loadItems = async repoUrl => {
  try {
    const [owner, repo] = repoUrl.split('/').slice(-2) // Extract owner and repo from the URL
    const githubPAT = process.env.PAT // Get PAT from .env

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/items`

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${githubPAT}`, // Authentication for private repos
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const files = await response.json()

    const items = []
    for (const file of files) {
      if (file.type === 'file' && file.name.endsWith('.csv')) {
        try {
          const fileResponse = await fetch(file.download_url)
          const csvText = await fileResponse.text()

          // Parse CSV data
          const parsedData = Papa.parse(csvText, { header: true }).data

          // Add type based on filename
          const type = file.name.slice(0, -5) // Remove 's' and '.csv' from filename

          // Set a default emoji or retrieve it based on type
          const emoji = type === 'dog' ? '🐶' : '📦'

          parsedData.forEach(row => {
            items.push({ ...row, type, emoji })
          })
        } catch (error) {
          console.error(`Error loading items from ${file.name}:`, error)
        }
      }
    }

    return items
  } catch (error) {
    console.error(`Error loading items from ${repoUrl}/items:`, error)
    return []
  }
}

export default defineConfig({
  test: {
    environment: 'jsdom', // TODO: this doesn't work, remove header comment workaround from tests when they fix it
  },
  plugins: [
    react({
      include: /\.(mdx|js|jsx|ts|tsx)$/,
      babel: {
        plugins: [path.resolve(__dirname, 'vite.config.plugin.js')],
      },
    }),
    {
      name: 'blueprint-loader',
      async configResolved(config) {
        const extensionsConfig = await fs.readFile('./extensions.json', 'utf-8')
        const extensions = JSON.parse(extensionsConfig)
        const allBlueprints = await loadBlueprints(extensions)

        // Load items
        const allItems = await loadItems('andraz/agi-os-blueprints')

        console.log(allItems)

        // Inject data into the Vite define option
        config.define = {
          ...config.define,
          'process.env.BLUEPRINTS': JSON.stringify(
            JSON.stringify(allBlueprints)
          ),
          'process.env.ITEMS': JSON.stringify(JSON.stringify(allItems)),
        }
      },
    },
  ],
  server: {
    port: 3333,
  },
})
