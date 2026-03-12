import { openAiUrl, webcamUrl, model, token } from './config.mjs'
import { prompt } from './prompt.mjs'
import { getImage } from './image.mjs'

// Fetch snapshot
const image = await getImage(webcamUrl)

const payload = {
  model,
  messages: [{
    role: 'user',
    content: [{
      type: 'text',
      text: prompt
    }]
  },
  {
    role: 'user',
    content: [{
        type: 'image_url',
        image_url: { url: `data:image/jpg;base64,${image}` } 
      }]
    
  }],
  response_format: {
    type: 'json_schema',
    json_schema: {
      schema: {
        type: 'object',
        properties: {
          status: {
            enum: ['ok', 'error']
          },
          error_type: {
            enum: ['none', 'spaghetti', 'nozzle_blob', 'bed_detach', 'layer_shift', 'collision']
          },
          confidence: {
            type: 'number',
            minimum: 0,
            maximum: 1.0
          },
          reason: {
            type: 'string',
            description: 'short explanation'
          }
        },
        required: ['status', 'confidence', 'reason']
      }
    }
  }
}

const response = await fetch(openAiUrl, {
  method: 'POST',
  body: JSON.stringify(payload),
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})

const openAiResponse = await response.json()
const analysis = JSON.parse(openAiResponse.choices[0].message.content)
console.log(analysis)
