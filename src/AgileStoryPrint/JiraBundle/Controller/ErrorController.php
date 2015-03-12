<?php

namespace AgileStoryPrint\JiraBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ErrorController extends Controller
{
    public function error404Action()
    {
        return $this->render(
            'AgileStoryPrintJiraBundle:Pages:message.html.twig',
            array(
                'title'     => 'error.404.title',
                'message'   => 'error.404.text'
            )
        );
    }

    public function error500Action()
    {
        return $this->render(
            'AgileStoryPrintJiraBundle:Pages:message.html.twig',
            array(
                'title'     => 'error.500.title',
                'message'   => 'error.500.text'
            )
        );
    }
}
