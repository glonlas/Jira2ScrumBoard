<?php

namespace AgileStoryPrint\JiraBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

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
            	'uploadForm' => $uploadForm->createView(),
                'contactForm' => $contactForm->createView()
            )
        );
    }

    public function getStoriesAction()
    {
        $form = $this->createForm(new UploadStoriesType());
        $form->handleRequest($this->getRequest());

        // Form validation
        if ($form->isValid())
        {
            try
            {
                $file = $form['file']->getData();

                $storyCards = new StoryCard();
                // try to get stories in the file
                if($storyCards->importFromFile($file))
                {
                    return $this->render(
                        'AgileStoryPrintJiraBundle:Pages:complete.html.twig',
                        array(
                            'stories' => $storyCards->getStories()
                        )
                    );
                }
                // No stories found
                else
                {
                    return $this->redirect($this->generateUrl('_emptyStory'));
                }
            }
            // The file is not a good one
            catch(\Exception $e)
            {
                return $this->redirect($this->generateUrl('_wrongFile'));
            }
        }
        else
        {
            $contactForm = $this->createForm(new ContactType());

            return $this->render(
                'AgileStoryPrintJiraBundle:Pages:index.html.twig',
                array(
                    'uploadForm' => $form->createView(),
                    'contactForm' => $contactForm->createView()
                )
            );
        }
    }

    public function emptyStoryAction()
    {
        return $this->render(
            'AgileStoryPrintJiraBundle:Pages:message.html.twig',
            array(
                'title'     => 'emptyStory.title',
                'message'   => 'emptyStory.text'
            )
        );
    }

    public function wrongFileAction()
    {
        return $this->render(
        	'AgileStoryPrintJiraBundle:Pages:message.html.twig',
        	array(
        		'title' 	=> 'wrongFile.title',
        		'message' 	=> 'wrongFile.text'
        	)
        );
    }
}
