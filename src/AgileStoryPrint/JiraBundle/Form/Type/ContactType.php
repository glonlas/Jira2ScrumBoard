<?php

namespace AgileStoryPrint\JiraBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Collection;

class ContactType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class)
            ->add('email', EmailType::class)
            ->add('phone', TextType::class)
            ->add('message', TextareaType::class);
    }

    public function configureOptions(OptionsResolver $resolver)
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
                'phone' => array(),
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

    public function getBlockPrefix()
    {
        return 'contact';
    }
}