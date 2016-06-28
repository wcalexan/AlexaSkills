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
    "Be not ashamed of mistakes and thus make them crimes.",
    "Before you embark on a journey of revenge, dig two graves.",
    "Everything has its beauty but not everyone sees it.",
    "Forget injuries, never forget kindnesses.",
    "He who will not economize will have to agonize.",
    "I hear and I forget. I see and I remember. I do and I understand.",
    "Ignorance is the night of the mind, but a night without moon and star.",
    "It does not matter how slowly you go so long as you do not stop.",
    "Men's natures are alike, it is their habits that carry them far apart.",
    "Our greatest glory is not in never falling, but in getting up every time we do.",
    "Respect yourself and others will respect you.",
    "Study the past if you would define the future.",
    "The superior man, when resting in safety, does not forget that danger may come. When in a state of security he does not forget the possibility of ruin. When all is orderly, he does not forget that disorder may come. Thus his person is not endangered, and his States and all their clans are preserved.",
    "To be able under all circumstances to practice five things constitutes perfect virtue; these five things are gravity, generosity of soul, sincerity, earnestness and kindness.",
    "To see what is right and not to do it is want of courage.",
    "To see what is right, and not to do it, is want of courage or of principle.",
    "What the superior man seeks is in himself; what the small man seeks is in others.",
    "When anger rises, think of the consequences.",
    "When we see men of a contrary character, we should turn inwards and examine ourselves.",
    "Wheresoever you go, go with all your heart.",
    "They must often change who would be constant in happiness or wisdom.",
    "By nature, men are nearly alike; by practice, they get to be wide apart.",
    "Fine words and an insinuating appearance are seldom associated with true virtue.",
    "Have no friends not equal to yourself.",
    "He who exercises government by means of his virtue may be compared to the north polar star, which keeps its place and all the stars turn towards it.",
    "He who speaks without modesty will find it difficult to make his words good.",
    "He with whom neither slander that gradually soaks into the mind, nor statements that startle like a wound in the flesh, are successful may be called intelligent indeed.",
    "Hold faithfulness and sincerity as first principles.",
    "I am not one who was born in the possession of knowledge; I am one who is fond of antiquity, and earnest in seeking it there.",
    "I have not seen a person who loved virtue, or one who hated what was not virtuous. He who loved virtue would esteem nothing above it.",
    "If a man takes no thought about what is distant, he will find sorrow near at hand.",
    "If a man withdraws his mind from the love of beauty, and applies it as sincerely to the love of the virtuous; if, in serving his parents, he can exert his utmost strength; if, in serving his prince, he can devote his life; if in his intercourse with his friends, his words are sincere - although men say that he has not learned, I will certainly say that he has.",
    "Is virtue a thing remote? I wish to be virtuous, and lo! Virtue is at hand.",
    "Learning without thought is labor lost; thought without learning is perilous.",
    "Recompense injury with justice, and recompense kindness with kindness.",
    "The cautious seldom err.",
    "The determined scholar and the man of virtue will not seek to live at the expense of injuring their virtue. They will even sacrifice their lives to preserve their virtue complete.",
    "The firm, the enduring, the simple, and the modest are near to virtue.",
    "The man of virtue makes the difficulty to be overcome his first business, and success only a subsequent consideration.",
    "The man who in view of gain thinks of righteousness; who in the view of danger is prepared to give up his life; and who does not forget an old agreement however far back it extends - such a man may be reckoned a complete man.",
    "The people may be made to follow a path of action, but they may not be made to understand it.",
    "The scholar who cherishes the love of comfort is not fit to be deemed a scholar.",
    "The superior man cannot be known in little matters, but he may be entrusted with great concerns. The small man may not be entrusted with great concerns, but he may be known in little matters.",
    "The superior man is modest in his speech, but exceeds in his actions.",
    "The superior man is satisfied and composed; the mean man is always full of distress.",
    "The superior man...does not set his mind either for anything, or against anything; what is right he will follow.",
    "There are three things which the superior man guards against. In youth...lust. When he is strong...quarrelsomeness. When he is old...covetousness.",
    "Things that are done, it is needless to speak about...things that are past, it is needless to blame.",
    "To be able to practice five things everywhere under heaven constitutes perfect virtue...gravity, generosity of soul, sincerity, earnestness, and kindness.",
    "To go beyond is as wrong as to fall short.",
    "Virtue is more to man than either water or fire. I have seen men die from treading on water and fire, but I have never seen a man die from treading the course of virtue.",
    "Virtue is not left to stand alone. He who practices it will have neighbors.",
    "What the superior man seeks is in himself. What the mean man seeks is in others.",
    "What you do not want done to yourself, do not do to others.",
    "When a man's knowledge is sufficient to attain, and his virtue is not sufficient to enable him to hold, whatever he may have gained, he will lose again.",
    "When we see men of worth, we should think of equaling them; when we see men of a contrary character, we should turn inwards and examine ourselves.",
    "When you have faults, do not fear to abandon them.",
    "When you know a thing, to hold that you know it; and when you do not know a thing, to allow that you do not know it - this is knowledge.",
    "With coarse rice to eat, with water to drink, and my bended arm for a pillow - I have still joy in the midst of these things. Riches and honors acquired by unrighteousness are to me as a floating cloud.",
    "Without an acquaintance with the rules of propriety, it is impossible for the character to be established.",
    "While you are not able to serve men, how can you serve spirits [of the dead]?...While you do not know life, how can you know about death?",
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
        response.ask("You can say 'Tell me a quote', or, you can say 'exit'... What can I help you with?", "What can I help you with?");
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
    var speechOutput = "Confucious says: " + randomFact;
    var cardTitle = "A quote from Confucious";
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var fact = new Fact();
    fact.execute(event, context);
};

