## ⚠️ Requirement ⚠️

- You need to create an AWS IAM with S3 permission
- Ref. [https://supsystic.com/documentation/id-secret-access-key-amazon-s3/](https://supsystic.com/documentation/id-secret-access-key-amazon-s3/)

## Features

- Utilize [Pica.js](https://github.com/nodeca/pica) for image compression and optimization
- Integrate AWS Services (S3) using AWS-SDK
- Implement UI design using [Blueprint.js](https://blueprintjs.com/)

## Demo Site

- [https://me.josh.com.tw/file-upload-system/](https://me.josh.com.tw/file-upload-system/)

## How to Start the Application

1. Clone the repository:

   ```sh
   $ git clone git@github.com:iskWang/file-upload-system.git
   ```

2. Navigate to the project directory:

   ```sh
   $ cd file-upload-system
   ```

3. Install the dependencies (using pnpm or your preferred package manager):

   ```sh
   $ pnpm install
   ```

4. Start the development server:
   ```sh
   $ pnpm dev
   ```

## Project Structure

```bash
/src
  /Asset
  /Component
  /Container
  /Lib
  /Presentation
  /Scene
  /test
  App.tsx
  main.tsx
```

### Main Component

### Component

Mainly for UI component

### Container

Connect reducer store and manage state logic.

- `/Container/App`: Manage IAM token and login flow

- `/Container/Dashboard`: Manage /dashboard page context store and actions.

### Presentation

The main UI page for combine components and reducer actions

- `/Presentation/Dashboard`: The /dashboard page of the components and container actions.

### Scene

Combines Container, Presentation, and is intended for future use with routing requirements(eg. redirect logout)
