<?php

namespace AgileStoryPrint\JiraBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request as Request;

class LegalController extends Controller
{
    public function cookieAction(Request $request)
    {
        return $this->render(
            'AgileStoryPrintJiraBundle:Pages:legal.html.twig',
            array(
                'title'     => 'cookie.title',
                'message'   => 'cookie.html'
            )
        );
    }

    public function termsAction(Request $request)
    {
        return $this->render(
            'AgileStoryPrintJiraBundle:Pages:legal.html.twig',
            array(
                'title'     => 'terms.title',
                'message'   => 'terms.html'
            )
        );
    }
}
