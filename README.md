
# GITT System

GITT is an inventory management system for the Technological Workshops of FISEI (Faculty of Systems, Electronics and Industrial Engineering) that allows equipment registration and management using barcodes.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Node.js (version 20.18.0)
- npm (usually comes with Node.js)

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Install the project dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the root directory of the project with the following content:

```
NEXT_PUBLIC_API_URL=YOUR_API_KEY
```

Replace `YOUR_API_KEY` with your actual API key.

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000). The page will automatically reload if you make changes to the code.

## Additional Information

For more information about Next.js, check out the [Next.js Documentation](https://nextjs.org/docs).