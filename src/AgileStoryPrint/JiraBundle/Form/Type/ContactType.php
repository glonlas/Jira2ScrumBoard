<?php

namespace AgileStoryPrint\JiraBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Collection;

class ContactType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', 'text')
            ->add('email', 'email')
            ->add('phone', 'text')
            ->add('message', 'textarea');
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $collectionConstraint = new Collection(
            array(
                'name' => array(
                    new NotBlank(array('message' => 'contact.name')),
                    new Length(array('min' => 2))
                ),
                'email' => array(
                    new NotBlank(array('message' => 'contact.email')),
                    new Email(array('message' => 'contact.email'))
                ),
                'message' => array(
                    new NotBlank(array('message' => 'contact.message')),
                    new Length(array('min' => 5))
                )
            )
        );

        $resolver->setDefaults(
            array(
                'constraints' => $collectionConstraint
            )
        );
    }

    public function getName()
    {
        return 'contact';
    }
}