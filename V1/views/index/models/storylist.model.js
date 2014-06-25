/**
 * StoryListModel
 * @module story/views/index/models/storylist
 * @requires model-list, story/views/index/models/story
 */
var

NS = 'story',

StoryListModel = function(config)
{
    StoryListModel.superclass.constructor.apply(this, arguments);
};

/**
 * StoryListModel
 * @class StoryListModel
 * @namespace Y.story
 */
Y.namespace(NS).StoryListModel = Y.extend(StoryListModel, Y.ModelList, {
    /**
	 * Load data from data storage of your choice. You can use ajax request,
	 * localstorage, jsonp, or whatever you want to get a JSON of data that will
	 * be mapped with the parse() method
	 * @method load
	 * @param {object} options Options to use in method set in sync method
	 * @param {function} callback Callback to execute after retreiving data
	 */
    _listStories: [],

    addStory: function(story)
    {
        if(story != null)
        {
            this._listStories.push(story);

            this.reset(this._listStories);
            this.saveInCache();
        }
    },
    loadFromCsv: function(csv)
    {
        var numLine = 0,
            listStories = [];

        Y.Array.each(
            csv,
            function(line)
            {
                // Skip the title line
                if(numLine >= 1)
                {
                    var id          = (line[0] === '') ? 'ID' : line[0],
                    feature         = (line[1] === '') ? '???' : line[1],
                    title           = (line[2] === '') ? 'Please insert the story title' : line[2],
                    businessvalue   = (line[3] === '') ? '?' : line[3],
                    effort          = (line[4] === '') ? '?' : line[4],
                    details         = (line[9] === '') ? 'Please insert the details here' : line[9],
                    requirements    = (line[10] === '') ? 'Please insert the requirements here' : line[10],
                    acceptance      = (line[11] === '') ? 'Please insert the acceptance here' : line[11],
                    team            = (line[6] === '') ? '???' : line[6],
                    sprint          = (line[7] === '') ? '???' : line[7];


                    listStories.push(
                        new Y.story.StoryModel(
                            {
                                id:             line[0],
                                feature:        line[1],
                                title:          line[2],
                                businessvalue:  line[3],
                                effort:         line[4],
                                details:        line[9],
                                requirements:   line[10],
                                acceptance:     line[11],
                                team:           line[6],
                                sprint:         line[7]
                            }
                        )
                    );
                }

                numLine++;
            }
        );

        this._listStories = listStories;
        this.reset(this._listStories);
        this.saveInCache();
    },
    loadFromCache: function()
    {
        var cache = this.get('cache').retrieve('stories')
            listStories = [];

        if( cache != null
            &&
            Y.Lang.isArray(cache.response)
            &&
            cache.response.length > 0
        )
        {
            Y.Array.each(
                cache.response,
                function(story)
                {
                    listStories.push(
                        new Y.story.StoryModel(
                            story
                        )
                    );
                },
                true
            );

            this._listStories = listStories;
            this.reset(this._listStories);

            return true;
        }
        else
        {
            return false;
        }

    },
    saveInCache: function()
    {
        var cache = this.get('cache');
        cache.flush();
        cache.add(
            "stories",
            this.toJSON()
        );
    },
    flushCache: function()
    {
        var cache = this.get('cache');
        cache.flush();

        this._listStories =[];
        this.reset(this._listStories);
    }

},
{
    NAME: 'StoryListModel',
    ATTRS: {
        cache: {
            valueFn: function()
            {
                return new Y.CacheOffline(
                    {
                        sandbox: this.get('cacheName'),
                        expires: this.get('cacheExpires')
                    }
                );
            }
        },
        cacheName: {
            value: 'storiesList'
        },
        cacheExpires: {
            value: 86400000
        }
    }
});
