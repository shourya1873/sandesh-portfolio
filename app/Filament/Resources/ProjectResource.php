<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProjectResource\Pages;
use App\Filament\Resources\ProjectResource\RelationManagers;
use App\Models\Project;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')->required()
                    ->debounce(500)
                    ->afterStateUpdated(fn($state, callable $set) => $set('url_key', Str::slug($state))
                    ),
                Textarea::make('short_description'),
                FileUpload::make('featured_image')
                    ->image()
                    ->columnSpan(2),
                FileUpload::make('project_media')
                    ->label('Project Media')
                    ->multiple()
                    ->directory('project-media')
                    ->maxSize(10240) // optional: 10MB
                    ->preserveFilenames()
                    ->reorderable()
                    ->downloadable()
                    ->openable()
                    ->panelLayout('grid')
                    ->acceptedFileTypes(['image/*', 'video/*'])
                    ->previewable(true),
                RichEditor::make('content')->required()
                    ->fileAttachmentsDisk('public')  // Store images in the "public" disk
                    ->fileAttachmentsDirectory('uploads/posts') // Directory inside "storage/app/public/"
                    ->fileAttachmentsVisibility('public')
                    ->columnSpan(2),
                TextInput::make('project_url')->required(),
                TextInput::make('url_key')
                    ->label('URL Key')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->dehydrated() // Ensures it still gets saved
                    ->helperText('Auto-generated from title.'),
                Toggle::make('is_active')
                    ->label('Active')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->sortable()->searchable(),
                Tables\Columns\ImageColumn::make('featured_image')
                    ->label('Featured Image')
                    ->disk('public') // adjust if you use a different disk
                    ->height(60)
                    ->width(60),
                TextColumn::make('created_at')->dateTime()->sortable(),
                TextColumn::make('updated_at')->dateTime()->sortable(),
                TextColumn::make('is_active')
                    ->label('Status')
                    ->badge()
                    ->colors([
                        'danger' => false,
                        'success' => true,
                    ])
                    ->formatStateUsing(fn (bool $state): string => $state ? 'Active' : 'Inactive'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProjects::route('/'),
            'create' => Pages\CreateProject::route('/create'),
            'edit' => Pages\EditProject::route('/{record}/edit'),
        ];
    }
}
