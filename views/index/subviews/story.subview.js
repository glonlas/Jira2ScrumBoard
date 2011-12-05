/**
 * StorySubview view
 * @module story/views/index/subviews/story
 * @requires ys/view, story/views/index/models/story
 */
var NS = 'story',

StorySubview = function(config)
{
    StorySubview.superclass.constructor.apply(this, arguments);
};

/**
 * story view
 * @class StorySubview
 * @namespace Y.story
 * @constructor
 */
Y.namespace(NS).StorySubview = Y.extend(StorySubview, Y.ys.View, {
    /**
     * View template defined in story.tpl.html file
     * @property template
     * @type string
     * @protected
     */
    template: {$story.tpl},

    bindUI: function()
    {
        // change value to input
        this.container.all('.edit span').on(
            'click',
            function(e)
            {
                this.editField(
                    e.target.get('parentNode')
                );
            },
            this
        );

        this.container.on(
            'keypress',
            function(e)
            {
                if( e.keyCode == 13
                    &&
                    !(
                        e.ctrlKey
                        ||
                        e.shiftKey
                     )
                )
                {
                    this.editField(
                        e.target.get('parentNode')
                    );
                }
            },
            this
        );
    },

    syncUI: function()
    {
        var story = this.get('story');

        this.container.one('.story_id span').set(
            'innerHTML',
            this.nl2br(
                story.get('id')
            )
        );
        this.container.one('.story_feature span').set(
            'innerHTML',
            this.nl2br(
                story.get('feature')
            )
        );
        this.container.one('.story_title span').set(
            'innerHTML',
            this.nl2br(
                story.get('title')
            )
        );
        this.container.one('.story_business_value span').set(
            'innerHTML',
            this.nl2br(
                story.get('businessvalue')
            )
        );
        this.container.one('.story_effort span').set(
            'innerHTML',
            this.nl2br(
                story.get('effort')
            )
        );
        this.container.one('.story_details span').set(
            'innerHTML',
            this.nl2br(
                story.get('details')
            )
        );
        this.container.one('.story_requirements span').set(
            'innerHTML',
            this.nl2br(
                story.get('requirements')
            )
        );
        this.container.one('.story_acceptance span').set(
            'innerHTML',
            this.nl2br(
                story.get('acceptance')
            )
        );
        this.container.one('.story_team span').set(
            'innerHTML',
            this.nl2br(
                story.get('team')
            )
        );
        this.container.one('.story_sprint span').set(
            'innerHTML',
            this.nl2br(
                story.get('sprint')
            )
        );
    },
    updateStory: function(){
        var story = this.get('story');

        story.set('id', this.container.one('.story_id span').get('innerHTML'));
        story.set('feature', this.container.one('.story_feature span').get('innerHTML'));
        story.set('title', this.container.one('.story_title span').get('innerHTML'));
        story.set('businessvalue', this.container.one('.story_business_value span').get('innerHTML'));
        story.set('effort', this.container.one('.story_effort span').get('innerHTML'));
        story.set('details', this.container.one('.story_details span').get('innerHTML'));
        story.set('requirements', this.container.one('.story_requirements span').get('innerHTML'));
        story.set('acceptance', this.container.one('.story_acceptance span').get('innerHTML'));
        story.set('team', this.container.one('.story_team span').get('innerHTML'));
        story.set('sprint', this.container.one('.story_sprint span').get('innerHTML'));

        story.sync('update');
    },

    editField: function(container)
    {
        var field   = container.one('span'),
        inputs      = container.all('input, textarea');

        inputs.each(
            function(input)
            {
                if(input.getStyle('display') === 'none')
                {
                    input.set(
                        'value',
                        this.br2nl(
                        field.get('innerHTML')
                    )
                );

                    field.hide();
                    input.show();
                }
                else
                {
                    // Dégager ce controle qui n'est vraiment pas beau
                    var value = input.get('value');
                    if(value === '')
                    {
                        value = '?';
                    }

                    value = this.nl2br(value);

                    field.set(
                        'innerHTML',
                        value
                    );

                    this.updateStory();

                    input.hide();
                    field.show();
                }
            },
            this
        );
    },
    nl2br: function(value)
    {
        return value.replace(/\n/gi, "<br />\n");
    },
    br2nl: function(value)
    {
        value =  value.replace(/\<br \/\>/gi, "\n");
        return value.replace(/\<br\>/gi, "");
    }
},
{
    /**
     * @attribute NAME
     */
    NAME: 'StorySubview',
    ATTRS: {
        story: {
            valueFn: function()
            {
                return new Y.story.StoryModel();
            }
        }
    }
});
