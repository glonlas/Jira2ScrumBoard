/**
 * Index view
 * @module story/views/index
 * @requires ys/view, cache, transition, story/views/index/classes/csvparser, story/views/index/models/storylist, story/views/index/models/story, story/views/index/subviews/story
 */
var NS = 'story',

CLASS_USER = 'user',

IndexView = function(config)
{
    IndexView.superclass.constructor.apply(this, arguments);
};

/**
 * Index view
 * @class IndexView
 * @namespace Y.test
 */
Y.namespace(NS).IndexView = Y.extend(IndexView, Y.ys.View, {
    template: {$index.tpl},

    _storyviews: [],

    // -------------------------------------------------------------------------
    // UI EVENT
    // -------------------------------------------------------------------------
    bindUI: function()
    {
        this.loadCache();


        // Navigation actions
        this.container.one('.action.import').on(
            'click',
            function(e)
            {
                e.preventDefault();
                this.resetView();
            },
            this
        );


        /*
         * Print
         */
        this.container.one('.action.print').on(
            'click',
            function(e)
            {
                e.preventDefault();
                setTimeout("print()", 500);
            },
            this
        );

        /*
        * Flush
        */
        this.container.one('.action.flush').on(
            'click',
            function(e)
            {
                e.preventDefault();
                this.flushStories();
            },
            this
        );
        /*
        * Add a story
        */
        this.container.one('.action.add').on(
            'click',
            function(e)
            {
                e.preventDefault();
                this.addStory(
                    new Y.story.StoryModel()
                );
            },
            this
        );

        /*
        * Save a story
        */
        this.container.one('.action.save').on(
            'click',
            function(e)
            {
                e.preventDefault();
                this.saveCache();
            },
            this
        );

        this.container.one('.dropdown').on(
            'click',
            function(e)
            {
                var dropdown = this.container.one('.dropdown-menu');
                if(dropdown.hasClass('displayBlock'))
                {
                    dropdown.removeClass('displayBlock');
                    dropdown.hide();
                }
                else
                {
                    dropdown.addClass('displayBlock');
                    dropdown.show();
                }
            },
            this
        );

        this.container.one('.close').on(
            'click',
            function(e)
            {
                e.target.get('parentNode').hide(true);
            },
            this
        );

        /*
         * IMPORT CSV
         */
        // Load a CSV
        this.container.one('[name="file"]').on(
            'change',
            this.readFile,
            this
        );

        /*
         * RESET Story list
         */
        this.get('list').after(
            'reset',
            this.syncUI,
            this
        );
    },

    syncUI: function()
    {
        Y.Lang.isArray(this._storyviews) && Y.Array.each(
            this._storyviews,
            function(s)
            {
                s.destroy();
            }
        );

        this._storyviews = [];

        this.get('list').each(
            function(story)
            {
                this.displayStory(story);
            },
            this
        );
    },
    UIRemoveMessages: function()
    {
        this.container.all('.alert-message').each(
            function(el)
            {
                el.hide(true);
            },
            this
        );
    },
    UIStoriesLoaded: function()
    {
        // Start hide all error messages
        this.UIRemoveMessages();

        var formNode = this.container.one('.hero-unit'),
        okMessageNode = this.container.one('.alert-message.success');

         // Hide the input form
        formNode.hide();
        okMessageNode.show();
    },
    UIErrorLoaded: function()
    {
        // Start hide all error messages
        this.UIRemoveMessages();

        var formNode = this.container.one('.hero-unit'),
        okMessageNode = this.container.one('.alert-message.success'),
        errorMessageNode = this.container.one('.alert-message.error');

        errorMessageNode.show(true);
        formNode.show();
        okMessageNode.hide();
    },
    resetView: function()
    {
        this.container.one('.hero-unit').show();
        this.UIRemoveMessages();
    },


    // -------------------------------------------------------------------------
    // User stories process
    // -------------------------------------------------------------------------
    displayStory: function(story)
    {
        var n = this.container.one('.stories'),
        view = new Y.story.StorySubview({
            story: story
        });

        n.append(view.render());


        this._storyviews[this._storyviews.length] = view;
    },
    addStory: function(story)
    {
        this.get('list').addStory(story);
    },
    flushStories: function()
    {
        this.get('list').flushCache();
        this.resetView();
    },

    readFile: function(e)
    {
        if (e.target._node.files[0])
        {
            var reader = new FileReader();

            try
            {
                alert(e.target._node.files[0].type);
                if(!e.target._node.files[0].type.match('.*csv.*'))
                {
                    throw 'wrong format';
                }

                reader.onload = Y.bind(
                    function(e)
                    {
                        this.parseCSV(e.target.result);
                    },
                    this
                );
                reader.readAsText(e.target._node.files[0]);

                this.UIStoriesLoaded();
            }
            catch (exception)
            {
                this.UIErrorLoaded();
            }
        }
    },

    parseCSV: function(el)
    {
        var parser = new Y.story.CSVParser();

        this.get('list').loadFromCsv(
            parser.csvToArray(
                el
            )
        );
    },

    loadCache: function()
    {
        if(this.get('list').loadFromCache())
        {
            this.UIStoriesLoaded();
        }
    },
    saveCache: function()
    {
        this.get('list').saveInCache();
    }
},
{
    NAME: 'IndexView',
    ATTRS: {
        list: {
            valueFn: function()
            {
                return new Y.story.StoryListModel();
            }
        }
    }
});
