import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

// Mock implementation to prevent build-time crashes if API key is missing
export const resend = apiKey 
  ? new Resend(apiKey) 
  : ({
      emails: {
        send: async () => ({ data: null, error: new Error('Resend API Key missing') })
      }
    } as any as Resend)