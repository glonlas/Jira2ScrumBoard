/**
 * @module story/views/index/tests/subviews/story
 * @requires story/views/index/subviews/story
 */
var suite = new Y.Test.Suite("StorySubview");

suite.add(
	new Y.Test.Case({

		name: "Test StorySubview",
	
		setUp: function()
		{
			this.data = new Y.story.StorySubview();
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
