# MemeMaster AI

Craft viral memes with AI, powered by your unique humor.

## Overview

MemeMaster AI is a web application that allows users to quickly generate and enhance memes using AI, with tools to predict virality and tune comedic style. The application uses OpenAI for meme caption generation, Supabase for authentication and data storage, Pinata for IPFS storage, and Stripe for subscription management.

## Features

- **Rapid Meme Creator**: Upload an image or provide a text prompt and have AI generate a meme with relevant captions in seconds.
- **AI Humor Tuner**: Select from predefined humor styles (witty, absurd, dry, edgy) or input keywords to guide the AI's comedic output.
- **Trend Analytics**: Identify currently trending topics, keywords, and popular meme templates across various social platforms to inform meme creation.
- **AI Meme Engagement Predictor**: Analyze a generated meme and provide a score or prediction on its potential shareability and virality, based on learned patterns.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Supabase (Authentication, Database, Storage)
- **AI**: OpenAI API
- **Storage**: Pinata (IPFS)
- **Payments**: Stripe

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- OpenAI API key
- Pinata API key
- Stripe account (for subscription features)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/mememaster-ai.git
cd mememaster-ai
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_API_KEY=your_pinata_secret_api_key
VITE_PINATA_GATEWAY=your_pinata_gateway
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. Set up the Supabase database schema:

- Create a new Supabase project
- Run the SQL commands in `supabase/migrations/schema.sql` to set up the database schema

5. Set up Stripe products and prices:

- Create products and prices in the Stripe dashboard
- Update the product IDs in the application code

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

### Build

Build the application for production:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Subscription Tiers

MemeMaster AI offers the following subscription tiers:

- **Free**: 3 meme generations per day, basic humor styles, standard meme templates.
- **Pro** ($10/month): 50 meme generations per day, all humor styles, advanced tuning options, trend analytics.
- **Viral** ($25/month): Unlimited meme generations, all Pro features, engagement predictor, priority support, custom meme templates.

## API Documentation

Detailed API documentation is available in the `docs` directory:

- [API Documentation](docs/api.md)
- [OpenAI Integration](docs/openai-integration.md)
- [Supabase Integration](docs/supabase-integration.md)
- [Pinata Integration](docs/pinata-integration.md)
- [Stripe Integration](docs/stripe-integration.md)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenAI](https://openai.com/) for the AI capabilities
- [Supabase](https://supabase.io/) for the backend services
- [Pinata](https://pinata.cloud/) for IPFS storage
- [Stripe](https://stripe.com/) for payment processing
- [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/) for the frontend

