<?php

namespace AgileStoryPrint\JiraBundle\Entity;

class Story
{
    protected $key;
    protected $project;
    protected $summary;
    protected $description;
    protected $type;
    protected $effort;
    protected $link;
    protected $version;
    protected $epic;

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

            if(isset($params['description']))
                $this->setDescription($params['description']);
			
			if(isset($params['type']))
				$this->setType($params['type']);

			if(isset($params['effort']))
				$this->setEffort($params['effort']);

			if(isset($params['link']))
				$this->setLink($params['link']);

            if(isset($params['version']))
                $this->setVersion($params['version']);

            if(isset($params['epic']))
                $this->setEpic($params['epic']);
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
    	$this->project = html_entity_decode($project);
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
    	$this->summary = html_entity_decode($summary);
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return void
     */
    public function setDescription($description)
    {
        $this->description = html_entity_decode($description);
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
    	$this->type = html_entity_decode($type);
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
        if($effort >= 1 OR $effort == 0.0)
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

    /**
     * Get version name
     *
     * @return string
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * Set version name
     *
     * @param string $version
     * @return void
     */
    public function setVersion($version)
    {
        $this->version = html_entity_decode($version);
    }

    /**
     * Get epic name
     *
     * @return string
     */
    public function getEpic()
    {
        return $this->epic;
    }

    /**
     * Set epic name
     *
     * @param string $project
     * @return void
     */
    public function setEpic($epic)
    {
        $this->epic = html_entity_decode($epic);
    }

}
