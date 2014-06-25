/**
 * @module story/views/index/tests/models/story
 * @requires story/views/index/models/story
 */
var suite = new Y.Test.Suite("StoryModel");

suite.add(
	new Y.Test.Case({

		name: "Test StoryModel",
	
		setUp: function()
		{
			this.data = new Y.story.StoryModel();
		},
		tearDown: function()
		{
			this.data.destroy();
		},
	
		testSomething : function ()
		{
			Y.assert(
				!Y.Lang.isUndefined(this.data)
			);
		}
	})
);

Y.Test.Runner.add(suite);
