/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const dayjs = require('dayjs');
const data = require('./data.json');
dayjs.extend(require('dayjs/plugin/timezone'))
dayjs.extend(require('dayjs/plugin/utc'))
dayjs.tz.setDefault('Asia/Tokyo')
const station = '大濠公園駅'
const cardTitle = '地下鉄の時間をお知らせします'
// const img = 'https://ridehailer.com/resources/card-images/race-car-large.png';


const getCurrentSubWayTime = () => {
  const now = dayjs().tz();
  let minute;
  let resultText;

  data.timeTable.forEach((v)=>{
    if(v.hour == now.hour()){
      for(let y of v.times){
        if(y > now.minute()){
          minute = y;
          break;
        }
      }
      resultText = `${station}の次の電車は\n${now.hour()}時${minute}分です`;
    }
  });
  return resultText ?? '電車の時間を見つけられませんでした';
};

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const speechText = getNearestTimeFromNow();
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(cardTitle, speechText)
      .getResponse();
  },
};

const OrderIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'OrderIntent';
  },
  handle(handlerInput) {
    const speechText = getNearestTimeFromNow();

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(cardTitle, speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    OrderIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
