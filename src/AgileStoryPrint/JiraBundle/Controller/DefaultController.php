<?php

namespace AgileStoryPrint\JiraBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

use AgileStoryPrint\JiraBundle\Form\Type\UploadStoriesType as UploadStoriesType;
use AgileStoryPrint\JiraBundle\Form\Type\ContactType as ContactType;
use AgileStoryPrint\JiraBundle\StoryCard\StoryCard as StoryCard;


class DefaultController extends Controller
{
    public function indexAction()
    {
        $uploadForm     = $this->createForm(new UploadStoriesType());
        $contactForm    = $this->createForm(new ContactType());

        return $this->render(
        	'AgileStoryPrintJiraBundle:Pages:index.html.twig',
        	array(
            	'uploadForm'  => $uploadForm->createView(),
                'contactForm' => $contactForm->createView()
            )
        );
    }
}
