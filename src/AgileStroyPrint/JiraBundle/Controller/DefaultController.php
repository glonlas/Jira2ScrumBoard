<?php

namespace AgileStroyPrint\JiraBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request as Request;

use AgileStroyPrint\JiraBundle\Entity\JiraExportFile as JiraExportFile;
use AgileStroyPrint\JiraBundle\Form\Type\JiraExportFileType as JiraExportFileType;
use AgileStroyPrint\JiraBundle\StoryCard\StoryCard as StoryCard;


class DefaultController extends Controller
{
    public function indexAction(Request $request)
    {
        $upload = new JiraExportFile();

        $form = $this->createForm(new JiraExportFileType(), $upload);
        $form->handleRequest($request);

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
                        'AgileStroyPrintJiraBundle:Pages:complete.html.twig',
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

        return $this->render(
        	'AgileStroyPrintJiraBundle:Pages:index.html.twig',
        	array(
            	'form' => $form->createView()
            )
        );
    }

    public function emptyStoryAction(Request $request)
    {
        return $this->render(
            'AgileStroyPrintJiraBundle:Pages:message.html.twig',
            array(
                'title'     => 'emptyStory.title',
                'message'   => 'emptyStory.text'
            )
        );
    }

    public function wrongFileAction(Request $request)
    {
        return $this->render(
        	'AgileStroyPrintJiraBundle:Pages:message.html.twig',
        	array(
        		'title' 	=> 'wrongFile.title',
        		'message' 	=> 'wrongFile.text'
        	)
        );
    }
}
