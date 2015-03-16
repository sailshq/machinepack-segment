module.exports = {


  friendlyName: 'Track user action',


  description: 'Track a user action by triggering an event in Segment.',


  extendedDescription: '',


  inputs: {

    writeKey: {
      example: 'C3ut91L4284abn2VdaJ2813Zc193042Kl4',
      description: 'The "write key" associated with your Segment account.',
      whereToGet: {
        url: 'https://segment.com/treeline/treeline.io/settings/keys',
        instructions: 'Copy and paste the "WRITE KEY" from the "API Keys" page in your Segment dashboard.'
      },
      required: true
    },

    userId: {
      description: 'A unique identifier for the user who performed this action.',
      extendedDescription: 'An arbitrary unique identifier for this user.',
      moreInfoUrl: 'https://segment.com/docs/spec/identify#identities',
      example: '019mr8mf4r',
      required: true
    },

    event: {
      description: 'The name of the action this user performed.',
      example: 'foobarbaz',
      required: true
    },

    properties: {
      typeclass: 'dictionary',
      description: 'A free-form dictionary of properties of the event, like "quantity".',
      extendedDescription: 'Certain properties have special meaning in Segment.  See the "Properties docs" on Segment\'s website for a list of special properties.',
      moreInfoUrl: 'https://segment.com/docs/spec/track#properties'
    },

    integrations: {
      typeclass: 'dictionary',
      description: 'A dictionary of Segment integrations to either enable or disable.',
      extendedDescription: '"All" is a special key that applies when no key for a specific integration is found. This input defaults "All" to true, and "Salesforce" and "Mixpanel" to false. This is because these integrations have strict limits on API calls, and you don\'t want to run over your limits by accident.',
      moreInfoUrl: 'https://segment.com/docs/spec/common#integrations',
      defaultsTo: {
        All: true,
        Salesforce: false,
        Mixpanel: false
      }
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
    },

  },


  fn: function (inputs,exits) {
    var SegmentIO = require('analytics-node');
    var api = new SegmentIO(inputs.writeKey);

    api.track({
      userId: inputs.userId,
      event: inputs.event,
      properties: inputs.properties||{},
      integrations: inputs.integrations||{
        All: true,
        Mixpanel: false,
        Salesforce: false
      }
    }, function(err, batch){
      if (err) return exits.error(err);
      return exits.success();
    });
  },



};
