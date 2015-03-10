<?php

namespace AgileStoryPrint\JiraBundle\Mailer;

class Email
{
    private $sender = null;
    private $recipient = null;
    private $replyTo = null;
    private $subject = null;
    private $template = null;
    private $locale = 'en';
    private $params = null;

    /**
     * Set email sender
     *
     * @param string|array $email Can be a string from the email address of the 
     * sender (ex : you@domain.com) or an array for Email and Name to display
     * (ex array('you@domain.com' => 'Jean Paul LEGRAND') )
     * @return void
     */
    public function setSender($email)
    {
        $this->sender = $email;
    }

    /**
     * Get the email of the sender (and name if specified) 
     *
     * @return string $sender
     */
    public function getSender()
    {
        return $this->sender;
    }

    /**
     * Set email recipient
     *
     * @param string|array $email Can be a string from the email address of the 
     * recipient (ex : you@domain.com) or an array for Email and Name to display
     * (ex array('you@domain.com' => 'Jean LEGRAND') )
     * @return void
     */
    public function setRecipient($email)
    {
        $this->recipient = $email;
    }

    /**
     * Get the email of the recipient (and name if specified) 
     *
     * @return string $recipient
     */
    public function getRecipient()
    {
        return $this->recipient;
    }

    /**
     * Set Reply-to email
     *
     * @param string|array $email Can be a string from the email address 
     * (ex : you@domain.com) or an array for Email and Name to display
     * (ex array('you@domain.com' => 'Jean LEGRAND') )
     * @return void
     */
    public function setReplyTo($email)
    {
        $this->replyTo = $email;
    }

    /**
     * Get the Reply-To email address (and name if specified) 
     *
     * @return string $replyTo
     */
    public function getReplyTo()
    {
        return $this->replyTo;
    }

    /**
     * Set subject key
     *
     * @param string $subject Subject to display in the email title, this key
     * will be automatically translated if found in email.[lang].xlf
     * @return void
     */
    public function setSubject($subject)
    {
        $this->subject = $subject;
    }

    /**
     * Get subject key
     *
     * @return string $subject
     */
    public function getSubject()
    {
        return $this->subject;
    }

    /**
     * Set template file
     *
     * @param string $template Twig Template to use 
     * @return void
     */
    public function setTemplate($template)
    {
        $this->template = $template;
    }

    /**
     * Get template file
     *
     * @return string Twig template path
     */
    public function getTemplate()
    {
        return $this->template;
    }

    /**
     * Set lang for the translator
     *
     * @param string Lang code for the translator (ex: en) 
     * @return void
     */
    public function setLocale($locale)
    {
        $this->locale = $locale;
    }

    /**
     * Get lang for the translator 
     *
     * @return string lang code
     */
    public function getLocale()
    {
        return $this->locale;
    }

    /**
     * Set params to pass through the Twig template
     *
     * @param array params for the Twig template
     * @return void
     */
    public function setParams(array $params)
    {
        $this->params = $params;
    }

    /**
     * Get params to pass through the Twig template
     *
     * @return array for the Twig template
     */
    public function getParams()
    {
        return $this->params;
    }
}
