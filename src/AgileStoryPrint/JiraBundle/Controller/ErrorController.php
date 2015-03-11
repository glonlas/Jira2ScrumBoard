<?php

namespace AgileStoryPrint\JiraBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request as Request;

class ErrorController extends Controller
{
    public function error404Action(Request $request)
    {
        return $this->render(
            'AgileStoryPrintJiraBundle:Pages:message.html.twig',
            array(
                'title'     => 'error.404.title',
                'message'   => 'error.404.text'
            )
        );
    }

    public function error500Action(Request $request)
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
