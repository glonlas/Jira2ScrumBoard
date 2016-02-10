<?php

namespace AgileStoryPrint\JiraBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

use AgileStoryPrint\JiraBundle\Form\Type\UploadStoriesType as UploadStoriesType;
use AgileStoryPrint\JiraBundle\Form\Type\ContactType as ContactType;
use AgileStoryPrint\JiraBundle\StoryCard\StoryCard as StoryCard;


class StoriesController extends Controller
{
    const INDEX_CARD = 'card';
    const WALLPLANNING_CARD = 'epics';

    public function getCardsAction()
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
                    // return PDF file
                    return $this->getEpicsCards($storyCards);
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
                'message'   => 'emptyStory.text',
                'help'      => array(
                    'title' => 'emptyStory.help.title',
                    'text' => 'emptyStory.help.text'
                )
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

    private function getCards(StoryCard $storyCards, $layout = self::INDEX_CARD)
    {
       $html = $this->renderView(
            'AgileStoryPrintJiraBundle:StoryCard:'.$layout.'.html.twig',
            array(
                'stories' => $storyCards->getStories()
            )
        );

        return new Response(
            $this->get('knp_snappy.pdf')->getOutputFromHtml($html),
            200,
            array(
                'Cache-Control'         => 'private',
                'Content-Type'          => 'application/pdf',
                'Content-Disposition'   => 'attachment; filename="'.uniqid('stories-').'.pdf"'
            )
        ); 
    }

    protected function getStoriesCards(StoryCard $storyCards)
    {
        return $this->getCards($storyCards, self::INDEX_CARD);
    }

    protected function getEpicsCards(StoryCard $storyCards)
    {
        return $this->getCards($storyCards, self::WALLPLANNING_CARD);
    }

}
