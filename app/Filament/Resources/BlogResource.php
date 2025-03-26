<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BlogResource\Pages;
use App\Filament\Resources\BlogResource\RelationManagers;
use App\Models\Blog;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class BlogResource extends Resource
{
    protected static ?string $model = Blog::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('blog_title')->required()
                    ->debounce(500)
                    ->afterStateUpdated(fn ($state, callable $set) =>
                    $set('url_key', Str::slug($state))
                    ),
                RichEditor::make('content')->required()
                    ->fileAttachmentsDisk('public')  // Store images in the "public" disk
                    ->fileAttachmentsDirectory('uploads/posts') // Directory inside "storage/app/public/"
                    ->fileAttachmentsVisibility('public')
                    ->columnSpan(2),
                FileUpload::make('featured_image')
                    ->image()
                    ->columnSpan(2),
                TagsInput::make('tags')
                    ->label('Tags')
                    ->placeholder('Add tags...')
                    ->separator(',')
                    ->suggestions(['Laravel', 'React', 'Tailwind', 'Filament']),
                 TextInput::make('url_key')
                     ->label('URL Key')
                     ->required()
                     ->unique(ignoreRecord: true)
                     ->dehydrated() // Ensures it still gets saved
                     ->helperText('Auto-generated from title.'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('blog_title')->sortable()->searchable(),
                TextColumn::make('created_at')->dateTime()->sortable(),
                TextColumn::make('updated_at')->dateTime()->sortable()
            ])
            ->filters([
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
            'index' => Pages\ListBlogs::route('/'),
            'create' => Pages\CreateBlog::route('/create'),
            'edit' => Pages\EditBlog::route('/{record}/edit'),
        ];
    }
}
