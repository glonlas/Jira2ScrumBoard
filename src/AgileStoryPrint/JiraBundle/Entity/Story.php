<?php

namespace AgileStoryPrint\JiraBundle\Entity;

class Story
{
    protected $key;
    protected $project;
    protected $summary;
    protected $type;
    protected $effort;
    protected $link;

    /**
     * Constructor
     *
     * @param array $params
     * @return void
     */
    public function __construct($params = null)
    {
    	if(is_array($params))
    	{
    		if(isset($params['key']))
    			$this->setKey($params['key']);

			if(isset($params['project']))
				$this->setProject($params['project']);

			if(isset($params['summary']))
				$this->setSummary($params['summary']);
			
			if(isset($params['type']))
				$this->setType($params['type']);

			if(isset($params['effort']))
				$this->setEffort($params['effort']);

			if(isset($params['link']))
				$this->setLink($params['link']);
    	}
    }

    /**
     * Get Story ID
     *
     * @return string
     */
    public function getKey()
    {
    	return $this->key;
    }

    /**
     * Set Story ID
     *
     * @param string $key
     * @return void
     */
    public function setKey($key)
    {
    	$this->key = $key;
    }

    /**
     * Get project name
     *
     * @return string
     */
    public function getProject()
    {
    	return $this->project;
    }

    /**
     * Set project name
     *
     * @param string $project
     * @return void
     */
    public function setProject($project)
    {
    	$this->project = $project;
    }

    /**
     * Get summary
     *
     * @return string
     */
    public function getSummary()
    {
    	return $this->summary;
    }

    /**
     * Set summary
     *
     * @param string $summary
     * @return void
     */
    public function setSummary($summary)
    {
    	$this->summary = $summary;
    }

    /**
     * Get Story type
     *
     * @return string
     */
    public function getType()
    {
    	return $this->type;
    }

    /**
     * Set Story type
     * ex: Issue, Story, Epic, ...
     *
     * @param string $type Nature of the story
     * @return void
     */
    public function setType($type)
    {
    	$this->type = $type;
    }

    /**
     * Get Effort points
     *
     * @return float/int
     */
    public function getEffort()
    {
    	return $this->effort;
    }

    /**
     * Set Effort points
     * If the number is above 1, we cast it to an integer
     *
     * @param float $effort
     * @return void
     */
    public function setEffort($effort)
    {
        if($effort >= 1)
        {
            $effort = intval($effort);
        }

    	$this->effort = $effort;
    }

    /**
     * Get Link
     *
     * @return string
     */
    public function getLink()
    {
    	return $this->link;
    }

    /**
     * Set Link
     *
     * @param string $link
     * @return void
     */
    public function setLink($link)
    {
    	$this->link = $link;
    }

}
