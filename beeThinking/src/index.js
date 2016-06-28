/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Space Geek for a space fact"
 *  Alexa: "Here's your space fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing space facts.
 */
var FACTS = [
    "There are three types of bees in the hive – Queen, Worker and Drone.",
    "The queen may lay 600-800 or even 1,500 eggs each day during her 3 or 4 year lifetime.",
    "The queen's daily egg production may equal her own weight.",
    "The queen is constantly fed and groomed by attendant worker bees.",
    "Honeybees fly at 15 miles per hour.",
    "Honeybees' wings stroke 11,400 times per minute, thus making their distinctive buzz.",
    "Honeybees will usually travel approximately 3 miles from their hive.",
    "Honeybees are the only bees that die after they sting.",
    "Honeybees are responsible for pollinating approx 80% of all fruit, vegetable and seed crops in the U.S.",
    "Honeybees have five eyes, 3 small ones on top of the head and two big ones in front.  They also have hair on their eyes!",
    "Bees communicate with each other by dancing and by using pheromones (scents).",
    "Honeybees never sleep!",
    "Honey is 80% sugars and 20% water.",
    "To make one pound of honey, the bees in the colony must visit 2 million flowers, fly over 55,000 miles and require the lifetime work of approximately 768 bees.",
    "A single honeybee will only produce approximately 1/12 teaspoon of honey in her lifetime.",
    "A single honeybee will visit 50-100 flowers on a single trip out of the hive.",
    "Bees produce honey as food stores for the hive during the long months of winter when flowers aren't blooming and therefore little or no nectar is available to them.",
    "Honey is the ONLY food that includes all the substances necessary to sustain life, including water.",
    "A typical bee hive can make up to 400 pounds of honey per year.",
    "Honey never spoils.",
    "It would take about 1 ounce of honey to fuel a honeybee's flight around the world.",
    "Flowers and other blossoming plants have nectarines that produce sugary nectar.",
    "When the bee's honey stomach is full the bee returns to the hive and puts the nectar in an empty honeycomb.",
    "Natural chemicals from the bee's head glands and the evaporation of the water from the nectar change the nectar into honey.",
    "Out of 20,000 species of bees, only 4 make honey.",
    "Although Utah enjoys the title The Beehive State, the top honey-producing states include California, Florida, and South Dakota.",
    "A populous colony may contain 40,000 to 60,000 bees during the late spring or early summer.",
    "A honeycomb cell has six sides.",
    "Bees maintain a temperature of 92-93 degrees Fahrenheit in their central brood nest regardless of whether the outside temperature is 110 or -40 degrees.",
    "The worker bees are all female and they do all the work for the hive.",
    "Worker bees perform the following tasks inside the hive as a House Bee: Cleaning, feeding the baby bees, feeding and taking care of the queen, packing pollen and nectar into cells, capping cells, building and repairing honeycombs, fanning to cool the hive and guarding the hive.",
    "Workers perform the following tasks outside the hive as Field Bees: Gathering nectar and pollen from flowers, collecting water and a sticky substance called propolis.",
    "Bees have two stomachs - one stomach for eating and the other special stomach is for storing nectar collected from flowers or water so that they can carry it back to their hive.",
    "The male bees in the hive are called drones. Their job in the hive is to find a queen to mate with.",
    "Male bees fly out and meet in special drone congregation areas where they hope to meet a queen.",
    "Male drone bees don't have a stinger.",
    "If a worker bee uses her stinger, she will die.",
    "Bees go through four stages of development: Egg, Larvae, Pupae and Adult Bee.",
    "The bees use their honeycomb cells to raise their babies in, and to store nectar, honey, pollen and water.",
    "Nectar is a sweet watery substance that the bees gather. After they process the nectar in their stomach they regurgitate it into the honeycomb cells. Then they fan with their wings to remove excess moisture. The final result is honey.",
    "Bees are the only insect in the world that make food that humans can eat.",
    "Honey has natural preservatives and bacteria can't grow in it.",
    "Honey was found in the tombs in Egypt and it was still edible! Bees have been here around 30 million years.",
    "Bees have straw-like tongues called a proboscis so they can suck up liquids and also mandibles so they can chew.",
    "Bees carry pollen on their hind legs called a pollen basket. Pollen is a source of protein for the hive and is needed to feed to the baby bees to help them grow.",
    "Bees have 2 pairs of wings. The wings have tiny teeth so they can lock together when the bee is flying.",
    "Bees communicate through chemical scents called pheromones and through special bee dances.",
    "A single beehive can make more than 100 pounds (45 kg) of extra honey. The beekeeper only harvests the extra honey made by the bees.",
    "The average life of a honey bee during the working season is about three to six weeks. There are five products that come from the hive: Honey, beeswax, pollen, propolis, and royal jelly.",
    "Beeswax is produced by the bees. Bees have special glands on their stomach that secrete the wax into little wax pockets on their stomach. The bee takes the wax and chews it with her mandibles and shapes it to make honeycomb.",
    "Propolis is a sticky substance that bees collect from the buds of trees. Bees use propolis to weatherproof their hive against drafts or in spots where rain might leak in.",
    "People have discovered the anti-bacterial properties of propolis for use in the medical field.",
    "Royal Jelly is a milky substance produced in a special gland in the worker bee's head. For her whole life the Queen is fed Royal Jelly by the workers.",
    "Although bears do like honey, they prefer to eat the bee larvae.",
    "Honey comes in different colours and flavours. The flower that the nectar was gathered from determines the flavour and colour of the honey.",
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * SpaceGeek is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Fact = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Fact.prototype = Object.create(AlexaSkill.prototype);
Fact.prototype.constructor = Fact;

Fact.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    //console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Fact.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    //console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Fact.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    //console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Fact.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say 'Tell me a fact', or, you can say 'exit'... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random space fact from the space facts list
    var factIndex = Math.floor(Math.random() * FACTS.length);
    var randomFact = FACTS[factIndex];

    // Create speech output
    var speechOutput = randomFact;
    var cardTitle = "A honey bee fact";
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var fact = new Fact();
    fact.execute(event, context);
};

