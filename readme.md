# Basic Restful API (consuming PokeAPI)
This is Restful API with Typescript-Express-Axios that consume PokeApi as data source.

What you need before running this code:
- Node.js `14.20.x`

And install the package!
# How to run the project?
1. First of all, do run `npm i` or `yarn install`
2. Then, run `npm run start` or `yarn start` to start the project. Make sure your node version is atleast `v14.20`.
3. Access backend on `http://localhost:8000/`
4. You can also access the API Documentation (im using swagger) on `http://localhost:8000/v1/api-docs`

## Configuration
You can personally change configuration such as Port in `./src/constants`

# Folder Structure
Folder structure will be like this:
```
- docs
--> routes (this is where i put swagger documentation)
- src (this is all of code i place)
--> constants    <mostly for redefine .env or constants variables>
--> controllers  <this is where controllers, validation, services>
--> middlewares  <custom middlewares>
--> modules      <add-ons to app>
--> routes       <regist controller to the routes here>
--> services     <module for services ex. Axios>
--> utils        <utilites~>
--> wrapper      <anything needs tobe wrap>
--> app.ts       <file: where i define express>
--> server.ts    <file: as first point node js start>

