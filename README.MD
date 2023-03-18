#Pet API
API where I left some small example of custom layer architecture.
How to work with: 
* reflect-metadata
* inversify
* Decorators
* IoC Container
* DI
* Prisma ORM

What you can learn from this project:
###Layered architecture
In layered architecture I have used:
Middleware for Controllers
Controllers themselves
Connected Services to Controllers
Services work with DTOs, Repositories
Repositories work with the Prism Model

###Authorization
Also worked with authorization with JWT token

###Dependency Injection
As u might know, IoC is implementation of Dependency Injection pattern which based on 2 principals: 
first is Inversion of Control (isolated component which not lay on implementation of realisation of another component) 
second is Dependency Inversion Principle (The top modules do not import the lower modules, but both depend on abstractions that do not depend on parts. And just the parts depend on the abstractions)

With help of inversify, reflect-metadata and decorators managed to recreate 
the IoC Container in which I collected dependencies for the project

###Database
Working with Prisma a bit
