# API Contracts

### baseApi = api/v1

## authRouter

- POST baseApi/auth/signup
- POST baseApi/auth/login
- PATCH basrApi/auth/logout

## profileRouter

- GET baseApi/profile/view
- PATCH baseApi/profile/edit
- PATCH baseApi/profile/reset-password

## connectionRequestRouter

- POST baseApi/request/interested/:userId
- POST baseApi/request/ignored/:userId
- POST baseApi/request/accepted/:requestId
- POST baseApi/request/rejected/:requestId

## userRouter

- GET baseApi/user/connections
- GET baseApi/user/feed
- GET baseApi/user/requests

Status: ignored, interested, accepted, rejected
