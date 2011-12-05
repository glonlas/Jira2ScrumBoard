/**
 * @module story/views/index/tests/models/storylist
 * @requires story/views/index/models/storylist
 */
var suite = new Y.Test.Suite("StoryListModel");

suite.add(
	new Y.Test.Case({

		name: "Test StorylistModel",
	
		setUp: function()
		{
			this.data = new Y.story.StoryListModel();
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
