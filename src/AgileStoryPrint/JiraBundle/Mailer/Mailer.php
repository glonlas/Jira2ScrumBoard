<?php

namespace AgileStoryPrint\JiraBundle\Mailer;

use \Symfony\Component\DependencyInjection\ContainerAware;
use Twig_Environment as Environment;
use AgileStoryPrint\JiraBundle\Mailer\Email as Email;

class Mailer extends ContainerAware
{
    protected $mailer;
    protected $twig;
    protected $adminEmail;

    public function __construct(\Swift_Mailer $mailer, Environment $twig, $adminEmail)
    {
        $this->mailer       = $mailer;
        $this->twig         = $twig;
        $this->adminEmail   = $adminEmail;
    }

    public function sendEmail(Email $email)
    {
        // Get email content (Subject, HTML body, Text body)
        $content = $this->getContent($email);

        // Préparation et envoi du message
        $message = \Swift_Message::newInstance()
            ->setFrom($email->getSender())
            ->setTo($email->getRecipient())
            ->setSubject($content['subject'])
            ->setBody($content['bodyText'], 'text/plain')
            ->addPart($content['bodyHtml'], 'text/html')
        ;
        return $this->mailer->send($message);
    }

    protected function getContent(Email $email)
    {
        $params = $email->getParams();
        $params['locale'] = $email->getLocale();

        $template = $this->twig->loadTemplate($email->getTemplate());
 
        return array(
            'subject'   => $template->renderBlock('subject', $params),
            'bodyHtml'  => $template->renderBlock('body_html', $params),
            'bodyText'  => $template->renderBlock('body_text', $params)
        );
    }

    /* Specifics email */
    public function sendContactMessage($formData)
    {
        $email = new Email();
        $email->setSender(
            array(
                $formData['email'] => $formData['name']
            )
        );
        $email->setRecipient($this->adminEmail);
        $email->setSubject('new.message');
        $email->setTemplate('AgileStoryPrintJiraBundle:Emails:contact.html.twig');
        $email->setParams(
            array(
                'name'      => $formData['name'],
                'email'     => $formData['email'],
                'phone'     => $formData['phone'],
                'message'   => $formData['message'],
                'ip'        => $formData['ip']
            )
        );

        return $this->sendEmail($email);
    }
}
