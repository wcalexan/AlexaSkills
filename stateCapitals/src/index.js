/**
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

 http://aws.amazon.com/apache2.0/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * This sample shows how to create a simple Trivia skill with a multiple choice format. The skill
 * supports 1 player at a time, and does not support games across sessions.
 */

'use strict';

/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 * Make sure the first answer is the correct one. Set at least 4 answers, any extras will be shuffled in.
 */
var STATES = [
	{"state": "Alabama",		"capital": "Montgomery"},
	{"state": "Alaska",		"capital": "Juneau"},
	{"state": "Arizona",		"capital": "Phoenix"},
	{"state": "Arkansas",		"capital": "Little Rock"},
	{"state": "California",		"capital": "Sacramento"},
	{"state": "Colorado",		"capital": "Denver"},
	{"state": "Connecticut",	"capital": "Hartford"},
	{"state": "Delaware",		"capital": "Dover"},
	{"state": "Florida",		"capital": "Tallahassee"},
	{"state": "Georgia",		"capital": "Atlanta"},
	{"state": "Hawaii",		"capital": "Honolulu"},
	{"state": "Idaho",		"capital": "Boise"},
	{"state": "Illinois",		"capital": "Springfield"},
	{"state": "Indiana",		"capital": "Indianapolis"},
	{"state": "Iowa",		"capital": "Des Moines"},
	{"state": "Kansas",		"capital": "Topeka"},
	{"state": "Kentucky",		"capital": "Frankfort"},
	{"state": "Louisiana",		"capital": "Baton Rouge"},
	{"state": "Maine",		"capital": "Augusta"},
	{"state": "Maryland",		"capital": "Annapolis"},
	{"state": "Massachusetts",	"capital": "Boston"},
	{"state": "Michigan",		"capital": "Lansing"},
	{"state": "Minnesota",		"capital": "St. Paul"},
	{"state": "Mississippi",	"capital": "Jackson"},
	{"state": "Missouri",		"capital": "Jefferson City"},
	{"state": "Montana",		"capital": "Helena"},
	{"state": "Nebraska",		"capital": "Lincoln"},
	{"state": "Nevada",		"capital": "Carson City"},
	{"state": "New Hampshire",	"capital": "Concord"},
	{"state": "New Jersey",		"capital": "Trenton"},
	{"state": "New Mexico",		"capital": "Santa Fe"},	
	{"state": "New York",		"capital": "Albany"},
	{"state": "North Carolina",	"capital": "Raleigh"},
	{"state": "North Dakota",	"capital": "Bismarck"},	
	{"state": "Ohio",		"capital": "Columbus"},
	{"state": "Oklahoma",		"capital": "Oklahoma City"},
	{"state": "Oregon",		"capital": "Salem"},
	{"state": "Pennsylvania",	"capital": "Harrisburg"},
	{"state": "Rhode Island",	"capital": "Providence"},
	{"state": "South Carolina",	"capital": "Columbia"},
	{"state": "South Dakota",	"capital": "Pierre"},
	{"state": "Tennessee",		"capital": "Nashville"},
	{"state": "Texas",		"capital": "Austin"},
	{"state": "Utah",		"capital": "Salt Lake City"},
	{"state": "Vermont",		"capital": "Montpelier"},
	{"state": "Virginia",		"capital": "Richmond"},
	{"state": "Washington",		"capital": "Olympia"},
	{"state": "West Virginia",	"capital": "Charleston"},
	{"state": "Wisconsin",		"capital": "Madison"},
	{"state": "Wyoming",		"capital": "Cheyenne"},	
];

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

//     if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.05aecccb3-1461-48fb-a008-822ddrt6b516") {
//         context.fail("Invalid Application ID");
//      }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // handle yes/no intent after the user has been prompted
    if (session.attributes && session.attributes.userPromptedToContinue) {
        delete session.attributes.userPromptedToContinue;
        if ("AMAZON.NoIntent" === intentName) {
            handleFinishSessionRequest(intent, session, callback);
        } else if ("AMAZON.YesIntent" === intentName) {
            handleRepeatRequest(intent, session, callback);
        }
    }

    // dispatch custom intents to handlers here
    if ("AnswerIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AnswerOnlyIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("DontKnowIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.YesIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.NoIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.StartOverIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.RepeatIntent" === intentName) {
        handleRepeatRequest(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        handleGetHelpRequest(intent, session, callback);
    } else if ("AMAZON.StopIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else if ("AMAZON.CancelIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

// ------- Skill specific logic -------
//

// Some global variables for the skill.
//
var ANSWER_COUNT = 4;
var GAME_LENGTH = 5;
var CARD_TITLE = "State Capitals";

// This function is responsible for starting the game.
//   - it gives a brief introduction
//   - it asks the first question
//
function getWelcomeResponse(callback) {
    var sessionAttributes = {};
    var speechOutput = "I will ask you " + GAME_LENGTH.toString() + " questions. Try to get as many right as you can. When prompted, just say the name of the state capital as the answer. Let's begin. ";
    var currentQuestionIndex = 0;
    var shouldEndSession = false;
    var gameStates= populateGameStates();
    var stateCapitalPair = STATES[gameStates[currentQuestionIndex]];
    var repromptText = "Question 1.  What is the capital of " + stateCapitalPair.state + "?";
    speechOutput += repromptText;

    sessionAttributes = {
        "speechOutput": speechOutput + " " + repromptText,
        "repromptText": repromptText,
        "currentQuestionIndex": currentQuestionIndex,
        "questions": gameStates,
        "score": 0,
        "correctAnswerText": stateCapitalPair.capital,
    };
    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));
}

// We populate an array with GAME_LENGTH indices (e.g. [0..(GAME_LENGTH-1)]).  These indices index into STATES[].
//   - return gamesStates[], an array of length GAME_LENGTH
//
function populateGameStates() {
    var gameStates = [];

    if(GAME_LENGTH <= STATES.length){
        // Populate a list of state indices (0..TOTAL # STATES).  As we pick a state
	// we will take it out of the list so we don't repeat states.
	//
        var indexList = [];
        for (var i = 0; i < STATES.length; i++){
            indexList.push(i);
        }

        // We start with the total number of states remaining.
	//   - we pick a random index between 0..remainingStates
	//   - we push the value of that element of the list onto the list of states for this game
	//   - we delete the element of the list we just used
	//   - we indicate we now have one less remainingStates
	//
        var remainingStates = STATES.length;
        for(var q = 0; q < GAME_LENGTH; q++) {
            var randIndex = Math.floor(Math.random() * remainingStates);
            gameStates.push(indexList[randIndex]);
	    indexList.splice(randIndex, 1);
	    --remainingStates;
        }
    } else {
        throw "Invalid Game Length.";
    }

    return gameStates;
}

function handleAnswerRequest(intent, session, callback) {
    var speechOutput = "";
    var sessionAttributes = {};
    var gameInProgress = session.attributes && session.attributes.questions;
    var userGaveUp = (intent.name === "DontKnowIntent");

    if (!gameInProgress) {
        // If the user responded with an answer but there is no game in progress, ask the user
        // if they want to start a new game. Set a flag to track that we've prompted the user.
        //
        sessionAttributes.userPromptedToContinue = true;
        speechOutput = "There is no game in progress. Do you want to start a new game? ";
        callback(sessionAttributes,
            buildSpeechletResponse(CARD_TITLE, speechOutput, speechOutput, false));
    } else {
        var gameStates = session.attributes.questions;
        var currentScore = parseInt(session.attributes.score);
        var currentQuestionIndex = parseInt(session.attributes.currentQuestionIndex);
        var correctAnswerText = session.attributes.correctAnswerText;

        // Generate a ruling on the users answer.
        //
        var speechOutputAnalysis = "";
        if ((typeof intent.slots != "undefined") && (intent.slots.Answer.value === correctAnswerText)) {
            currentScore++;
            speechOutputAnalysis = "correct. ";
        } else {
            if (!userGaveUp) {
                speechOutputAnalysis = "wrong. ";
            }
            speechOutputAnalysis += "The correct answer is " + correctAnswerText + ". ";
        }

        // If currentQuestionIndex is (GAME_LENGTH - 1), we've reached the last question and will exit the game session.
        //
        speechOutput = userGaveUp ? "" : "That answer is " + speechOutputAnalysis;
        if (currentQuestionIndex == (GAME_LENGTH - 1)) {
            speechOutput += "You got " + currentScore.toString() + " out of "
                + GAME_LENGTH.toString() + " questions correct. Thank you for playing!";
            callback(session.attributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, "", true));
        } else {
            currentQuestionIndex += 1;
            var stateCapitalPair = STATES[gameStates[currentQuestionIndex]];
            var repromptText = "Question " + (currentQuestionIndex + 1).toString() + ". ";
            repromptText += "What is the capital of " + stateCapitalPair.state + "?";
            speechOutput += repromptText;

            sessionAttributes = {
                "speechOutput": repromptText,
                "repromptText": repromptText,
                "currentQuestionIndex": currentQuestionIndex,
                "questions": gameStates,
                "score": currentScore,
                "correctAnswerText": stateCapitalPair.capital,
            };
            callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));
        }
    }
}

function handleRepeatRequest(intent, session, callback) {
    // Repeat the previous speechOutput and repromptText from the session attributes if available
    // else start a new game session
    if (!session.attributes || !session.attributes.speechOutput) {
        getWelcomeResponse(callback);
    } else {
        callback(session.attributes,
            buildSpeechletResponseWithoutCard(session.attributes.speechOutput, session.attributes.repromptText, false));
    }
}

function handleGetHelpRequest(intent, session, callback) {
    // Provide a help prompt for the user, explaining how the game is played. Then, continue the game
    // if there is one in progress, or provide the option to start another one.

    // Set a flag to track that we're in the Help state.
    session.attributes.userPromptedToContinue = true;

    // Do not edit the help dialogue. This has been created by the Alexa team to demonstrate best practices.

    var speechOutput = "I will ask you " + GAME_LENGTH + " questions. Respond with the name of the capital city that is"
        + "the answer.  For example you might say 'Columbus'. To start a new game at any time, say, start game. "
        + "To repeat the last question, say, repeat. "
        + "Would you like to keep playing?",
        repromptText = "To give an answer to a question, respond with the name of the capital city that is the answer. "
        + "Would you like to keep playing?";
        var shouldEndSession = false;
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye!", "", true));
}

// ------- Helper functions to build responses -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

