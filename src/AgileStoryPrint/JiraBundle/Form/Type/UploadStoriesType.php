<?php

namespace AgileStoryPrint\JiraBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Collection;

class UploadStoriesType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('file', FileType::class);
    }

    public function configureOptions(OptionsResolver $resolver)
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
                                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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

    public function getBlockPrefix()
    {
        return 'uploadStories';
    }
}