<?php

namespace AgileStoryPrint\JiraBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request as Request;

use AgileStoryPrint\JiraBundle\Form\Type\ContactType as ContactType;

class ContactController extends Controller
{
    public function indexAction(Request $request)
    {
        $emailSent = false;
        $form = $this->createForm(new ContactType);

        if ($request->isMethod('POST'))
        {
            $form->bind($request);

            if ($form->isValid())
            {
                $formData = $form->getData();
                $formData['ip'] = $request->getClientIp();

                $emailSent = $this->get('asp.mailer')->sendContactMessage($formData);
            }
        }

        //return array('form' => $form->createView());

        return $this->render(
            'AgileStoryPrintJiraBundle:Pages:contact.html.twig',
            array(
                'contactForm'   => $form->createView(),
                'emailSent'     => $emailSent
            )
        );
    }
}
