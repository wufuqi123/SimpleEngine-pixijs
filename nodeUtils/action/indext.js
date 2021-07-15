const ParseAction = require("./ParseAction.js");
const MainDialog = require("./MainDialog.js");
const Spine = require("./Spine.js");
const Jump = require("./Jump.js");
let path = "./static/resources/chapter/action.xlsx";
let parseAction = new ParseAction();
parseAction.use(new Spine());
parseAction.use(new Jump());
parseAction.use(new MainDialog());
parseAction.parse(path);
// console.log(ParseAction)