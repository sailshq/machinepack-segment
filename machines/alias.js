module.exports = {


  friendlyName: 'Alias',


  idempotent: true,


  description: 'Merge two user identities, effectively connecting two sets of user data as one.',


  extendedDescription: 'This is an advanced method, but it is required to manage user identities successfully in some of Segment\'s integrations.',


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

    sourceUserId: {
      description: 'The existing id you\'ve identified this user with previously.',
      extendedDescription: 'Generally this comes from a trusted source, like your database.',
      moreInfoUrl: 'https://segment.com/docs/spec/identify#identities',
      example: '019mr8mf4r',
      required: true
    },

    destinationUserId: {
      description: 'A unique id which references either a new or a different pre-existing identity that user data in Segment should be merged into.',
      extendedDescription: 'Generally this comes from a trusted source, like your database.',
      moreInfoUrl: 'https://segment.com/docs/spec/identify#identities',
      example: '439z31jrq1',
      required: true
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
    },

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

    api.alias({
      userId: inputs.destinationUserId,
      previousId: inputs.sourceUserId,
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
