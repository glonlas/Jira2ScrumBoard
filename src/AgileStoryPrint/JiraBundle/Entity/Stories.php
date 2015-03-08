<?php

namespace AgileStoryPrint\JiraBundle\Entity;

use Symfony\Component\HttpFoundation\File\UploadedFile as UploadedFile;
use AgileStoryPrint\JiraBundle\Entity\Story as Story;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
class Stories extends Controller
{
    protected $stories = [];

    public function getStories()
    {
    	return $this->stories;
    }

    public function addStory(Story $story)
    {
    	$this->stories[$story->getKey()] = $story;
    }

    public function removeStory(Story $story)
    {
    	unset($this->stories[$story->getKey()]);
    }
}
