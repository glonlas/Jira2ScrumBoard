<?php

namespace AgileStoryPrint\JiraBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

use AgileStoryPrint\JiraBundle\Form\Type\UploadStoriesType as UploadStoriesType;
use AgileStoryPrint\JiraBundle\Form\Type\ContactType as ContactType;
use AgileStoryPrint\JiraBundle\StoryCard\StoryCard as StoryCard;


class StoriesController extends Controller
{
    public function getStoriesAction(Request $request)
    {
        $form = $this->createForm(UploadStoriesType::class);
        $form->handleRequest($request);

        // Form validation
        if ($form->isSubmitted() && $form->isValid())
        {
            try
            {
                $file = $form['file']->getData();

                $storyCards = new StoryCard();
                // try to get stories in the file
                if($storyCards->importFromFile($file))
                {
                    // return PDF file
                    return $this->getStoriesCards($storyCards);
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
            $contactForm = $this->createForm(ContactType::class);

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

    protected function getStoriesCards(StoryCard $storyCards)
    {
       $html = $this->renderView(
            'AgileStoryPrintJiraBundle:StoryCard:card.html.twig',
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
}
