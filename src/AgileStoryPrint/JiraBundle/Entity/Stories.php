<?php

namespace AgileStoryPrint\JiraBundle\Entity;

use Symfony\Component\HttpFoundation\File\UploadedFile as UploadedFile;
use AgileStoryPrint\JiraBundle\Entity\Story as Story;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
class Stories extends Controller
{
    protected $stories = [];

    /**
     * Get a list of Stories
     *
     * @return array Array of Story objects
     */
    public function getStories()
    {
    	return $this->stories;
    }

    /**
     * Add a Story object into the collection
     * An object already present in the collection will not be added again
     *
     * @param Story $story Story object to add
     * @return void
     */
    public function addStory(Story $story)
    {
    	$this->stories[$story->getKey()] = $story;
    }

    /**
     * Remove a Story object from the collection
     *
     * @param Story $story
     * @return void
     */
    public function removeStory(Story $story)
    {
    	unset($this->stories[$story->getKey()]);
    }
}
