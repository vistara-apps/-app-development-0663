# MemeMaster AI API Documentation

This document provides comprehensive documentation for the MemeMaster AI application's API endpoints and integration patterns.

## Table of Contents

1. [Authentication](#authentication)
2. [Meme Generation](#meme-generation)
3. [User Management](#user-management)
4. [Subscription Management](#subscription-management)
5. [IPFS Storage](#ipfs-storage)
6. [Error Handling](#error-handling)

## Authentication

Authentication is handled through Supabase, which provides a secure, JWT-based authentication system.

### Sign Up

**Endpoint:** `POST /auth/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2023-01-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "expires_at": 1672531200
  }
}
```

### Sign In

**Endpoint:** `POST /auth/signin`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2023-01-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "expires_at": 1672531200
  }
}
```

### Sign Out

**Endpoint:** `POST /auth/signout`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Response:**
```json
{
  "success": true
}
```

## Meme Generation

### Generate Meme

**Endpoint:** `POST /api/memes/generate`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Request:**
```json
{
  "prompt": "A cat wearing a business suit looking confused at a computer",
  "humorStyle": "witty",
  "type": "text"
}
```

**Response:**
```json
{
  "id": "uuid",
  "caption": "When the code compiles on the first try but you don't know why",
  "image": "https://example.com/meme-image.jpg",
  "prompt": "A cat wearing a business suit looking confused at a computer",
  "humorStyle": "witty",
  "engagementScore": 85,
  "engagementMetrics": {
    "shareability": 76,
    "relatability": 93,
    "timing": 80,
    "humorScore": 89
  },
  "engagementInsights": "This meme has excellent viral potential! The witty humor style aligns well with current trends.",
  "timestamp": "2023-01-01T00:00:00Z"
}
```

### Get User Memes

**Endpoint:** `GET /api/memes`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Response:**
```json
{
  "memes": [
    {
      "id": "uuid",
      "caption": "When the code compiles on the first try but you don't know why",
      "image": "https://example.com/meme-image.jpg",
      "prompt": "A cat wearing a business suit looking confused at a computer",
      "humorStyle": "witty",
      "engagementScore": 85,
      "timestamp": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Get Meme by ID

**Endpoint:** `GET /api/memes/:id`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Response:**
```json
{
  "id": "uuid",
  "caption": "When the code compiles on the first try but you don't know why",
  "image": "https://example.com/meme-image.jpg",
  "prompt": "A cat wearing a business suit looking confused at a computer",
  "humorStyle": "witty",
  "engagementScore": 85,
  "engagementMetrics": {
    "shareability": 76,
    "relatability": 93,
    "timing": 80,
    "humorScore": 89
  },
  "ipfsCid": "QmXyZ...",
  "ipfsMetadataCid": "QmAbc...",
  "timestamp": "2023-01-01T00:00:00Z"
}
```

### Delete Meme

**Endpoint:** `DELETE /api/memes/:id`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Response:**
```json
{
  "success": true
}
```

## User Management

### Get User Profile

**Endpoint:** `GET /api/profile`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Response:**
```json
{
  "id": "uuid",
  "username": "user123",
  "displayName": "John Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "bio": "Meme enthusiast",
  "createdAt": "2023-01-01T00:00:00Z"
}
```

### Update User Profile

**Endpoint:** `PUT /api/profile`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Request:**
```json
{
  "displayName": "John Smith",
  "bio": "Professional meme creator"
}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "user123",
  "displayName": "John Smith",
  "avatarUrl": "https://example.com/avatar.jpg",
  "bio": "Professional meme creator",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-02T00:00:00Z"
}
```

## Subscription Management

### Get Subscription Plans

**Endpoint:** `GET /api/subscription-plans`

**Response:**
```json
{
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "description": "Basic meme generation with limited features",
      "price": 0,
      "priceId": "price_free",
      "features": [
        "3 meme generations per day",
        "Basic humor styles",
        "Standard meme templates"
      ],
      "isPopular": false
    },
    {
      "id": "pro",
      "name": "Pro",
      "description": "Advanced meme creation with more generations",
      "price": 10,
      "priceId": "price_pro",
      "features": [
        "50 meme generations per day",
        "All humor styles",
        "Advanced tuning options",
        "Trend analytics"
      ],
      "isPopular": true
    },
    {
      "id": "viral",
      "name": "Viral",
      "description": "Unlimited meme generation with all premium features",
      "price": 25,
      "priceId": "price_viral",
      "features": [
        "Unlimited meme generations",
        "All Pro features",
        "Engagement predictor",
        "Priority support",
        "Custom meme templates"
      ],
      "isPopular": false
    }
  ]
}
```

### Get User Subscription

**Endpoint:** `GET /api/subscription`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Response:**
```json
{
  "tier": "pro",
  "status": "active",
  "currentPeriodStart": "2023-01-01T00:00:00Z",
  "currentPeriodEnd": "2023-02-01T00:00:00Z",
  "cancelAtPeriodEnd": false
}
```

### Create Checkout Session

**Endpoint:** `POST /api/create-checkout-session`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Request:**
```json
{
  "priceId": "price_pro"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_..."
}
```

### Create Customer Portal Session

**Endpoint:** `POST /api/create-customer-portal-session`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

## IPFS Storage

### Upload Meme to IPFS

**Endpoint:** `POST /api/ipfs/upload`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Request:**
```json
{
  "memeId": "uuid"
}
```

**Response:**
```json
{
  "imageCid": "QmXyZ...",
  "metadataCid": "QmAbc...",
  "imageUrl": "https://gateway.pinata.cloud/ipfs/QmXyZ...",
  "metadataUrl": "https://gateway.pinata.cloud/ipfs/QmAbc..."
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

Error responses follow this format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

Common error codes:

- `authentication_error`: Authentication failed
- `authorization_error`: Insufficient permissions
- `validation_error`: Invalid request parameters
- `not_found`: Resource not found
- `rate_limit_exceeded`: Rate limit exceeded
- `server_error`: Internal server error

