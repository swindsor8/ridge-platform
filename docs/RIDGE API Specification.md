# RIDGE API Specification

## Auth

POST /auth/register
POST /auth/login

## Users

GET /users/profile
PATCH /users/profile

## Stands

GET /stands
POST /stands
PATCH /stands/{id}

## Hunts

POST /hunts
GET /hunts
GET /hunts/{id}

## Community

GET /posts/feed
POST /posts
POST /posts/{id}/like
POST /posts/{id}/comment

## Trophy Room

GET /trophy-room/categories
GET /trophy-room/leaderboard

## Survival

GET /survival/guides
