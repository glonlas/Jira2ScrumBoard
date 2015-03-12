<?php

namespace AgileStoryPrint\JiraBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class LegalController extends Controller
{
    public function cookieAction()
    {
        return $this->render(
            'AgileStoryPrintJiraBundle:Pages:legal.html.twig',
            array(
                'title'     => 'cookie.title',
                'message'   => 'cookie.html'
            )
        );
    }

    public function termsAction()
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
