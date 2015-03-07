<?php

namespace AgileStroyPrint\JiraBundle\Entity;

class Story
{
    protected $key;
    protected $project;
    protected $summary;
    protected $type;
    protected $effort;
    protected $link;

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

    public function getKey()
    {
    	return $this->key;
    }

    public function setKey($key)
    {
    	$this->key = $key;
    }

    public function getProject()
    {
    	return $this->project;
    }

    public function setProject($project)
    {
    	$this->project = $project;
    }

    public function getSummary()
    {
    	return $this->summary;
    }

    public function setSummary($summary)
    {
    	$this->summary = $summary;
    }

    public function getType()
    {
    	return $this->type;
    }

    public function setType($type)
    {
    	$this->type = $type;
    }

    public function getEffort()
    {
    	return $this->effort;
    }

    public function setEffort($effort)
    {
        if($effort >= 1)
        {
            $effort = intval($effort);
        }

    	$this->effort = $effort;
    }

    public function getLink()
    {
    	return $this->link;
    }

    public function setLink($link)
    {
    	$this->link = $link;
    }

}
