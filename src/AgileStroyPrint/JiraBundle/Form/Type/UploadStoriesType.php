<?php

namespace AgileStroyPrint\JiraBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Collection;

class UploadStoriesType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('file', 'file');
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
	     $collectionConstraint = new Collection(array(
            'file' => array(
                new NotBlank(
                    array(
                        'message' => 'file.mandatory'
                    )
                ),
                new File(
                    array(
                        'maxSize'   => '1024k',
                        'maxSizeMessage' => 'file.size',
                        'mimeTypes' => array(
                                        'text/html', 
                                        'application/vnd.ms-excel', 
                                        'text/xml'
                                    ),
                        'mimeTypesMessage' => 'file.extension'

                    )
                )
            )
        ));

        $resolver->setDefaults(array(
            'constraints' => $collectionConstraint
        ));
	}

    public function getName()
    {
        return 'uploadStories';
    }
}