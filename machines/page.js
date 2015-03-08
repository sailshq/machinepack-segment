module.exports = {


  friendlyName: 'Track pageview',


  description: 'Track whenever a user sees a page of your website or screen of your mobile app, along with any properties about the page.',


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
      moreInfoUrl: 'https://segment.com/docs/spec/identify#identities',
      example: '019mr8mf4r',
      required: true
    },

    pageName: {
      description: 'The name of the of the page, for example "Signup" or "Home".',
      example: 'Signup',
      required: true
    },

    pageCategory: {
      description: 'The category of the page. Useful for things like ecommerce where many pages often live under a larger category.',
      example: 'Docs'
    },

    properties: {
      typeclass: 'dictionary',
      description: 'A free-form dictionary of properties of the page, like "keywords" or "referrer".',
      extendedDescription: 'Certain properties like "url" or "title" have special meaning in Segment.  See the "Properties docs" on Segment\'s website for a list of special properties.',
      moreInfoUrl: 'https://segment.com/docs/spec/page#properties'
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

    var opts = {
      userId: inputs.userId,
      properties: inputs.properties||{},
      integrations: inputs.integrations||{
        All: true,
        Mixpanel: false,
        Salesforce: false
      }
    };

    if (inputs.pageName) {
      opts.name = inputs.pageName;
    }
    if (inputs.pageCategory) {
      opts.category = inputs.pageCategory;
    }

    api.page(opts, function(err, batch){
      if (err) return exits.error(err);
      return exits.success();
    });
  },



};
