# MaxQ Employee and Work Management Platform

This application is a Mini Pet Project which allows for Employee and Work
Management.

## 🌐 Demo

[Application Demo (Frontend)](http://employee-work-management.s3-website.eu-west-3.amazonaws.com/)

**Demo Credentials:**

- **Username:** test@maxq.com
- **Password:** Test12345

## 📖 About this Software

This application is an Employee and Work Management application to help with
project and employees managing easier.

### Features:

1. **Authorization:** Application allows for registration and authorization
   of users

### Services:

1. **Frontend:** Built using React + Typescript handles all client side
   operations
2. **Backend:** Backend is split into multiple microservices
    * **Authorization Service:** Responsible for all authorization related
      operations - registration and login -
      see [API docs here](https://authorization-service-0h7q.onrender.com/swagger-ui.html)

### Technology stack

* **Frontend:**
    * Typescript
    * React
    * TailwindCSS
    * React-Router
    * Vite + Vitest
    * React-Testing-Library
    * **Hosting** - AWS S3
* **Backend:**
    * Java
    * Spring
    * Gradle
    * JUnit
    * Swagger UI (API docs)
* **API Testing:**
    * Postman
* **UI Testing:**
    * PlaywrightTS
* **CI/CD:**
    * GitHub Actions

### CI/CD Pipelines

Several pipelines were created to allow automated integration, testing and
deployment:

1. Frontend CI pipeline - installs dependencies, lints, formats, tests and
   builds the application. Two artifacts are provided - test report
   (including coverage) and build files.
2. Backend CI pipeline - installs dependencies, lints, tests and builds the
   application. Unit test report is published as artifact.
3. API tests pipeline - after successfull build backend is tested with API
   tests. Report is published as artifact.
4. UI tests pipeline - if both API tests and Frontend CI pipeline is
   successfull UI tests are triggered. Report is published as artifact
5. Frontend CD pipeline - after successfull integration to main branch
   deployment will happen to AWS S3.

## 🖼️ Screenshots

To give you a visual overview of the application, here are some screenshots:

### [Feature or Page Name]

![Description of Image](http://link-to-your-image.com/image1.png)

### [Another Feature or Page Name]

![Description of Image](http://link-to-your-image.com/image2.png)
