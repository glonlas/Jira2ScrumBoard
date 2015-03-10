<?php

namespace AgileStoryPrint\JiraBundle\Mailer;

use Twig_Environment as Environment;
use AgileStoryPrint\JiraBundle\Mailer\Email as Email;

class Mailer
{
    protected $mailer;
    protected $twig;
    protected $adminEmail;
    protected $noReplyEmail;

    /**
     * Constructor
     *
     * @param Swift_Mailer $mailer 
     * @param Environment $twig
     * @param string $adminEmail
     * @param string $noReplyEmail
     * @param string $noReplyName
     * @return void
     */
    public function __construct(\Swift_Mailer $mailer, Environment $twig, $adminEmail, $noReplyEmail, $noReplyName)
    {
        $this->mailer       = $mailer;
        $this->twig         = $twig;
        $this->adminEmail   = $adminEmail;
        $this->noReplyEmail = array($noReplyEmail => $noReplyName);
    }

    /**
     * Send an email from a formatted Email object
     * This method will allow you to use Twig template to design HTML and Plain
     * text. Subject, HTML and Text will be translated
     *
     * @param Email $email
     * @return int how many emails sent
     */
    public function sendEmail(Email $email)
    {
        // Get body content (Subject, HTML body, Text body)
        $content = $this->getContent($email);

        // Email setup
        $message = \Swift_Message::newInstance()
            ->setFrom($email->getSender())
            ->setTo($email->getRecipient())
            ->setSubject($content['subject'])
            ->setBody($content['bodyText'], 'text/plain')
            ->addPart($content['bodyHtml'], 'text/html')
        ;

        if(!is_null($email->getReplyTo()))
        {
            $message->setReplyTo($email->getReplyTo());
        }

        return $this->mailer->send($message);
    }

    /**
     * Return an array with Email HTML, Plain text and subject from a Twig 
     * template. If you set a lang, all text will be translate following this
     * lang.
     *
     * @param Email $email
     * @return array('subject', 'bodyHtml', bodyText)
     */
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

    /**
     * Method to send the email from the Contact form
     *
     * @param array $formData Data from the contact form
     * @return int how many emails sent
     */
    public function sendContactMessage($formData)
    {
        $email = new Email();
        $email->setSender($this->noReplyEmail);
        $email->setRecipient($this->adminEmail);
        $email->setReplyTo(
            array(
                $formData['email'] => $formData['name']
            )
        );
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
