<?php

// tests/AgileStoryPrint/JiraBundle/Form/Type/ContactTypeTest.php
namespace Tests\AgileStoryPrint\JiraBundle\Form\Type;

use AgileStoryPrint\JiraBundle\Form\Type\ContactType;
use Symfony\Component\Form\Test\TypeTestCase;

class ContactTypeTest extends TypeTestCase
{

    public function testName()
    {
        $contactType = new ContactType();
        $this->assertEquals('contact', $contactType->getBlockPrefix());
    }

    public function testForm()
    {
        $formData = array(
            'name' => 'John Doe',
            'email' => 'john@doe.com',
            'phone' => '+1 (123) 456-7890',
            'message' => 'Hello world!',
        );

        $form = $this->factory->create(ContactType::class);

        // submit the data to the form directly
        $form->submit($formData);
        $this->assertTrue($form->isSynchronized());

        $this->assertTrue($form->isValid());
    }

}